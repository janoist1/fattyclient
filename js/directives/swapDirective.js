damFattyDirectives.directive('swap', ['Game', 'Graphics', function (Game, Graphics) {
    return {
        restrict: 'A',
        templateUrl: '/partials/_swap.html',
        link: function ($scope, elem, attrs) {
            var cardSwap = null;

            $scope.isSwapDone = Game.isSwapDone;
            $scope.cardsSwap = Game.getPlayer().cardsUp;

            $scope.swap = function (card) {
                Game.swap(card, cardSwap);
                $scope.cardsSwap = Game.getPlayer().cardsUp;
                $('#swap').modal('hide');

                Graphics.refresh();
            };

            $scope.swapDone = function () {
                Game.swapDone();
                Graphics.refresh();

                $scope.isSwapDone = Game.isSwapDone;
            };

            function registerEvents() {
                Graphics.hand.on('click', function (event) {
                    if (!Game.isSwapDone) {
                        cardSwap = event.target.card;
                        $('#swap').modal();
                    }
                });
            }

            function refresh() {
                var width = $(window).width();
                var height = $(window).height() - $('header nav').outerHeight(true);
                width = width < 640 ? 640 : width;
                height = height < 480 ? 480 : height;

                var swapDone = $('#swapDone');
                swapDone.css({
                    left: width / 2 - swapDone.outerWidth() / 2,
                    top: height / 2 - swapDone.outerHeight() / 2
                });
            }

            $scope.$watch('ready', function () {
                refresh();
                registerEvents();
            });
            $(window).resize(refresh);
        }
    }
}]);