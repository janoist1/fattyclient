'use strict';

damFattyControllers.controller('TableController', ['$scope', 'Game',
    function ($scope, Game) {
        $scope.table = Game.getTable();
        $scope.player = Game.getPlayer();
        $scope.isSwapDone = Game.isSwapDone;
        $scope.cardsAvailable = Game.getAvailableCards();
        $scope.cardsSwap = $scope.player.cards_up;

        var cardSwap = null;

        $scope.cardClick = function (cardId) {
            cardSwap = cardId;

            if (!Game.isSwapDone) {
                $('#swap').modal();
                return;
            }
        };

        $scope.swap = function (card) {
            Game.swap(card, cardSwap);

            $scope.cardsAvailable = Game.getAvailableCards();
            $scope.cardsSwap = $scope.player.cards_up;

            $('#swap').modal('hide');
        };

        $scope.swapDone = function () {
            Game.swapDone($scope.player.cards_up);

            $scope.isSwapDone = Game.isSwapDone;
            $scope.deckDown = Game.deckDown;
        };

        $scope.draw = function () {
            // todo: move it to a directive
            var table = Game.getTable();
            var count = table.players.length;
            var $table = $('#table');
            var $deck = $('#deck');
            var width = $table.innerWidth();
            var height = width * 0.66;
            var marginX = 0;
            var marginY = 0;
            var rotation = 90 * ((count+1) % 2);
            var playerW = 225;
            var playerH = 200;

            $table.height(height);
            $table.css('border-radius', height / 2);

            $table.find('.player').each(function (i) {
                var rad = ((360 / count * i) + rotation) * Math.PI / 180;
                var x = marginX + ((width - playerW) / 2 - marginX) + Math.sin(rad) * ((width - playerW) / 2 - marginX);
                var y = marginY + ((height - playerH) / 2 - marginY) + Math.cos(rad) * ((height - playerH) / 2 - marginY);

                $(this).css('left', x).css('top', y);
            });

            $deck.css('left', ($table.innerWidth() - $deck.width()) / 2);
            $deck.css('top', ($table.innerHeight() - $deck.height()) / 2);
        };

        $(window).resize($scope.draw);

        Game.on(Game.EVENT.TABLE_CHANGE, function () {
            $scope.$apply(function () {
                $scope.table = Game.getTable();
                $scope.player = Game.getPlayer();
            });
        });
//        Game.on(Game.EVENT.GAME_START, function () {
//            $scope.$apply(function () {
//                $scope.cardsAvailable = Game.getAvailableCards();
//                $scope.cardsSwap = $scope.player.cards_up;
//            });
//        });
    }
]);
