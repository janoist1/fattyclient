'use strict';

/* Directives */

var damFattyDirectives = angular.module('damFattyDirectives', []);


damFattyDirectives.directive('repeatDone', function () {
    return function (scope, element, attrs) {
        if (scope.$last) {
            scope.$eval(attrs.repeatDone);
        }
    }
});

damFattyDirectives.directive('player', function () {
    return {
        restrict: 'A',
        templateUrl: '/partials/_player.html',
        scope: {
            player: '='
        }
    }
});

damFattyDirectives.directive('cardSet', function () {
    return {
        restrict: 'A',
        templateUrl: '/partials/_cardSet.html',
        scope: {
            cards: '='
        },
        replace: true
    }
});

damFattyDirectives.directive('accessLevel', ['$rootScope', 'Auth',
    function ($rootScope, Auth) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                var prevDisp = element.css('display');
                var userRole;
                var accessLevel;

                $scope.$watch('user',
                    function (user) {
                        if (user.role) {
                            userRole = user.role;
                        }
                        updateCSS();
                    },
                    true
                );

                attrs.$observe('accessLevel',
                    function (al) {
                        if (al) {
                            accessLevel = $scope.$eval(al);
                        }
                        updateCSS();
                    }
                );

                function updateCSS() {
                    if (userRole && accessLevel) {
                        if (!Auth.authorize(accessLevel, userRole))
                            element.css('display', 'none');
                        else
                            element.css('display', prevDisp);
                    }
                }
            }
        };
    }
]);