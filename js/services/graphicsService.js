'use strict';

damFattyServices.factory('Graphics', ['Game', function (Game) {
    var canvas = document.createElement("canvas");
    var stage = new graphics.Stage(canvas);

    // todo: refactor of this service ...

    stage.init = function () {
        var me = Game.getPlayer();
        var players = _.without(Game.getTable().players, me);
        players.unshift(me);

        this.canvas.id = 'tableCanvas';
        this.removeAllChildren();
        this.initTable();
        this.initHand(Game.getPlayer().cardsHand);
        this.initPlayers(players);
        this.initDeckDown(Game.deckDown);
        this.initDeckUp(Game.deckUp);
    }.bind(stage);

    stage.refresh = function () {
        var width = $(window).width();
        var height = $(window).height() - $('header nav').outerHeight(true);
        width = width < 640 ? 640 : width;
        height = height < 480 ? 480 : height;

        this.canvas.width = width * graphics.pixelRatio;
        this.canvas.height = height * graphics.pixelRatio;
        $(this.canvas).css({
            width: width,
            height: height
        });

        this.setBounds(0, 0, width * graphics.pixelRatio, height * graphics.pixelRatio);
        this.drawTable();
        this.drawHand();
        this.drawPlayers();
        this.drawDeckDown();
        this.drawDeckUp();

        this.update();
    }.bind(stage);

    return stage;
}]);
