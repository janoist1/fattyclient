'use strict';

/* Directives */

var damFattyDirectives = angular.module('damFattyDirectives', []);


damFattyDirectives.directive('repeatDone', function() {
    return function(scope, element, attrs) {
        if (scope.$last) {
            scope.$eval(attrs.repeatDone);
        }
    }
});

damFattyDirectives.directive('cardSet', function() {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            if (scope.$last) {
                var html = $(element.parent().html());
                var html2 = $(element.parent());
                var $cards = html.find('.card');
                var cardsCount = $cards.length;
                var width = html.width();

                $cards.wrapAll('<div style="position: relative; float: left; width: 100%;"></div>');

                $cards.each(function(i,o) {
                    var x = (width / cardsCount) * i;
                    $(this).css('x', x);
                });
            }
        }
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