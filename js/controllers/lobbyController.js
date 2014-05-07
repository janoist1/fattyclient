'use strict';

damFattyControllers.controller('LobbyController', ['$scope', 'Navigation', 'Game',
    function ($scope, Navigation, Game) {
        $scope.tables = Game.tables;
        $scope.tableId = Game.tableId;
        $scope.newTableName = '';

        $scope.newTable = function () {
            Game.newTable($scope.newTableName);

            $scope.newTableName = '';
        };

        $scope.sitDown = function (tableId) {
            if (tableId == Game.tableId) {
                Navigation.navigateTo(Navigation.path('GatheringController', {tableId: tableId}));
                return;
            }

            Game.sitDown(tableId);
        };

        Game.on(Game.EVENT.GATHERING, function (tableId) {
            Navigation.navigateTo(Navigation.path('GatheringController', {tableId: tableId}));
        });
        Game.on(Game.EVENT.TABLE_CHANGE, function () {
            $scope.$apply(function() {
                $scope.tables = Game.tables;
            });
        });
    }
]);
