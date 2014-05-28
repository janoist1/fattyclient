'use strict';

damFattyControllers.controller('TableController', ['$scope', 'Game', 'Graphics',
    function ($scope, Game, Graphics) {

        Game.on(Game.EVENT.PLAYER_CHANGE, function () {
            Graphics.refresh();
        });
    }
]);
