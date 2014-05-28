damFattyDirectives.directive('table', ['Game', 'Graphics', function (Game, Graphics) {
    return {
        restrict: 'A',
        templateUrl: '/partials/_table.html',
        link: function ($scope, elem, attrs) {

            Graphics.init();

            $('#tableCanvas').replaceWith(Graphics.canvas);

            function turn(cards, player) {
                Game.turn(new CardSet(cards), player);
            }

            Graphics.hand.on('click', function (event) {
                if (Game.isSwapDone) {
                    var card = event.target.card;

                    if (card.value == 1) { // todo: replace "1" with a constant
                        $scope.showPlayers(function (player) {
                            turn([card], player);
                        });
                    } else {
                        turn([card], null);
                    }
                }
            });

            $scope.$watch('ready', Graphics.refresh);
            Game.on(Game.EVENT.TABLE_CHANGE, Graphics.refresh);
            Game.on(Game.EVENT.PLAYER_CHANGE, Graphics.refresh);
            Game.on(Game.EVENT.TURN, Graphics.refresh);
            $(window).resize(Graphics.refresh);
        }
    }
}]);