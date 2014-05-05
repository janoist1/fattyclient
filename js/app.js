'use strict';

/* App Module */

var damFattyApp = angular.module('DamFattyApp', [
    'ngRoute',
    'ngCookies',
    'damFattyAnimations',
    'damFattyControllers',
    'damFattyDirectives',
    'damFattyFilters',
    'damFattyServices'
]);
var damFattyControllers = angular.module('damFattyControllers', []);
var damFattyServices = angular.module('damFattyServices', ['ngResource']);

damFattyApp.config(['$routeProvider', '$locationProvider', '$httpProvider',
    function ($routeProvider, $locationProvider, $httpProvider) {

        for (var route in config.routing) {
            $routeProvider.when(config.routing[route].url, config.routing[route]);
        }

        $routeProvider.otherwise({redirectTo: config.routing.e404.url});

        $locationProvider.html5Mode(true);

        var interceptor = ['$location', '$q', function ($location, $q) {
            function success(response) {
                return response;
            }

            function error(response) {
                if (response.status === 401) {
                    $location.path(config.routing.login.url);
                    return $q.reject(response);
                }
                else {
                    return $q.reject(response);
                }
            }

            return function (promise) {
                return promise.then(success, error);
            }
        }];

        $httpProvider.responseInterceptors.push(interceptor);
    }
]);

damFattyApp.run(['$rootScope', 'Auth', 'Message', 'Client', 'Game', 'Navigation',
    function ($rootScope, Auth, Message, Client, Game, Navigation) {
        $rootScope.isLoading = false;
        $rootScope.messages = Message.getMessages();
        $rootScope.path = Navigation.path;

        Game.on(Game.EVENT.GATHERING, function (tableId) {
            Navigation.navigateTo(Navigation.path('GatheringController', {tableId: tableId}));
            $rootScope.isLoading = false;
        });

        //$rootScope.$watch('user', function () {
            if (!Client.isConnected() && Auth.isLoggedIn()) {
                Client.connect();
            }
        //});
    }
]);