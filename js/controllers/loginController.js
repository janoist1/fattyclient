'use strict';

damFattyControllers.controller('LoginController', ['$scope', 'Navigation', '$window', 'Auth', 'Client', 'Message',
    function ($scope, Navigation, $window, Auth, Client, Message) {

        $scope.login = function () {
            Auth.login({
                    email: $scope.email,
                    password: $scope.password,
                    rememberMe: $scope.rememberMe
                },
                function (res) {
                    Navigation.navigateTo(Navigation.path('LobbyController'));
                    Client.connect();
                },
                function (err) {
                    Message.danger("Failed to login");
                });
        };
    }
]);
