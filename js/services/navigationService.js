'use strict';

damFattyServices.factory('Navigation', ['$location', '$route', '$rootScope', 'Auth', 'Message',
    function ($location, $route, $rootScope, Auth, Message) {

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            Message.step();

            if (next.access !== undefined && !Auth.authorize(next.access)) {
                if (Auth.isLoggedIn()) {
                    Navigation.navigateTo(Navigation.path('LobbyController'));
                } else {
                    Navigation.navigateTo(Navigation.path('LoginController'));
                }
            }
        });

        var Navigation = {
            navigateTo: function (url) {
                var fn = function () {
                    $location.path(url);
                };

                // safe apply fn
                var phase = $rootScope.$$phase;
                if (phase == '$apply' || phase == '$digest') {
                    if (fn && (typeof(fn) === 'function')) {
                        fn();
                    }
                } else {
                    $rootScope.$apply(fn);
                }
            },

            path: function (controller, params) {
                for (var path in $route.routes) {
                    var pathController = $route.routes[path].controller;
                    if (pathController == controller) {
                        var result = path;
                        if (params !== undefined) {
                            for (var param in params) {
                                result = result.replace(':' + param, params[param]);
                            }
                        }
                        return result;
                    }
                }
                return undefined;
            }
        };

        return Navigation;
    }]);
