'use strict';

damFattyControllers.controller('GatheringController', ['$scope', 'Game', 'Navigation',
    function ($scope, Game, Navigation) {
        $scope.isReady = false;
        $scope.table = Game.getTable();

        $scope.ready = function () {
            Game.ready();

            $scope.isReady = Game.isReady;
        };

        $scope.notReady = function () {
            Game.notReady();

            $scope.isReady = Game.isReady;
        };

        $scope.leaveTable = function () {
            Game.leaveTable();
            Navigation.navigateTo(Navigation.path('LobbyController'));

            $scope.isReady = Game.isReady;
        };

        Game.on(Game.EVENT.TABLE_CHANGE, function () {
            $scope.$apply(function () {
                $scope.table = Game.getTable();
            });
        });
        Game.on(Game.EVENT.TABLE_READY, function () {
            $scope.$apply(function () {
                Navigation.navigateTo(Navigation.path('TableController', {tableId: $scope.table.id}));
            });
        });
    }
]);
