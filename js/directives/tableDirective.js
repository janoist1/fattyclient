damFattyDirectives.directive('table', ['Game', 'Graphics', function (Game, Graphics) {
    return {
        restrict: 'A',
        templateUrl: '/partials/_table.html',
        link: function ($scope, elem, attrs) {

            Graphics.init();

            $('#tableCanvas').replaceWith(Graphics.canvas);

            $scope.$watch('ready', Graphics.refresh);
            Game.on(Game.EVENT.TABLE_CHANGE, Graphics.refresh);
            Game.on(Game.EVENT.PLAYER_CHANGE, Graphics.refresh);
            Game.on(Game.EVENT.TURN, Graphics.refresh);
            $(window).resize(Graphics.refresh);
        }
    }
}]);