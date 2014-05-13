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

damFattyDirectives.directive('table', ['Game', function (Game) {
    return {
        restrict: 'A',
        templateUrl: '/partials/_table.html',
        link: function (scope, elem, attrs) {
            scope.draw = function () {
                var table = Game.getTable();
                var count = table.players.length;
                var $table = $('#table');
                var $deck = $('#deck');
                var width = $table.innerWidth();
                // todo: replace the constant numbers ...
                var height = width * 0.66;
                var marginX = 0;
                var marginY = 0;
                var rotation = 90 * ((count+1) % 2);
                var playerW = 225;
                var playerH = 200;

                $table.height(height);
                $table.css('border-radius', height / 2);

                $table.find('.player').each(function (i) {
                    var rad = ((360 / count * i) + rotation) * Math.PI / 180;
                    var x = marginX + ((width - playerW) / 2 - marginX) + Math.sin(rad) * ((width - playerW) / 2 - marginX);
                    var y = marginY + ((height - playerH) / 2 - marginY) + Math.cos(rad) * ((height - playerH) / 2 - marginY);

                    $(this).css('left', x).css('top', y);
                });

                $deck.css('left', ($table.innerWidth() - $deck.width()) / 2);
                $deck.css('top', ($table.innerHeight() - $deck.height()) / 2);
            };

            $(window).resize(scope.draw);

            scope.$watch('table', function (oldVal, newVal) {
                scope.draw()
            });
        }
    }
}]);

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