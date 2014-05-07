'use strict';

damFattyControllers.controller('NavController', ['$scope', 'Navigation', 'Auth', 'Game', 'Message',
    function ($scope, Navigation, Auth, Game, Message) {
        $scope.user = Auth.user;
        $scope.userRoles = Auth.userRoles;
        $scope.accessLevels = Auth.accessLevels;
        $scope.isPlayAvailable = false;

        Game.on(Game.EVENT.LOAD, function () {
            $scope.$apply(function () {
                $scope.isPlayAvailable = Game.tables != null && Game.tables.length > 0;
            });
        });

        $scope.play = function () {
            var table = Game.getTable();
            if (Game.isStarted) {
                Navigation.navigateTo(Navigation.path('TableController', {tableId: table.id}));
            } else if (table) {
                Navigation.navigateTo(Navigation.path('GatheringController', {tableId: table.id}));
            } else {
                var tableId = Game.tables[0].id;

                if (tableId == Game.tableId) {
                    Navigation.navigateTo(Navigation.path('GatheringController', {tableId: tableId}));
                    return;
                }

                Game.sitDown(tableId);
            }
        };

        $scope.logout = function () {
            Auth.logout(function () {
                Navigation.navigateTo(config.routing.index.url);
                Message.success("Logged out successfully.", true);
            });
        };
    }
]);
