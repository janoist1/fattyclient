damFattyDirectives.directive('choosePlayer', ['Game', 'Graphics', function (Game, Graphics) {
    return {
        restrict: 'A',
        templateUrl: '/partials/_choosePlayer.html',
        link: function ($scope, elem, attrs) {
            var callback = null;

            $scope.choosePlayer = function (player) {
                $('#choosePlayer').modal('hide');

                callback(player);
                callback = null;
            };

            $scope.showPlayers = function (cb) {
                callback = cb;
                $scope.$apply(function() {
                    $scope.players = Game.getTable().players;
                });

                $('#choosePlayer').modal();
            };
        }
    }
}]);