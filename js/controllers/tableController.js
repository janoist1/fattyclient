'use strict';

damFattyControllers.controller('TableController', ['$scope', 'Game',
    function ($scope, Game) {
        $scope.table = Game.getTable();
        $scope.player = Game.getPlayer();
        $scope.isSwapDone = Game.isSwapDone;
        $scope.cardsAvailable = Game.getAvailableCardSet();
        $scope.cardsSwap = Game.getPlayer().cardsUp;

        var cardSwap = null;

        $scope.cardClick = function (cardId) {

            if (!Game.isSwapDone) {
                cardSwap = cardId;
                $('#swap').modal();
                return;
            }
        };

        $scope.swap = function (card) {
            Game.swap(card, cardSwap);

            $scope.cardsAvailable = Game.getAvailableCardSet();
            $scope.cardsSwap = Game.getPlayer().cardsUp;

            $('#swap').modal('hide');
        };

        $scope.swapDone = function () {
            Game.swapDone();

            $scope.isSwapDone = Game.isSwapDone;
            $scope.deckDown = Game.deckDown;
        };

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
