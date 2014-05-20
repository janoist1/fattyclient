(function (graphics, createjs, undefined) {

    function Stage(canvas) {
        this.initialize(canvas);

        // todo: implement a loader...
        var bitmap = new createjs.Bitmap('/images/cards-retina.png');
        bitmap.image.onload = function () {
            this.update();
        }.bind(this);
    }

    Stage.prototype = new createjs.Stage;
    Stage.prototype.players = [];
    Stage.prototype.table = null;
    Stage.prototype.hand = null;
    Stage.prototype.deckUp = null;
    Stage.prototype.deckDown = null;

    /**
     * Players
     */
    Stage.prototype.addPlayers = function (players) {
        this.players = [];
        for (var i in players) {
            var player = new graphics.Player(players[i], i == 0);
            player.setBounds(0, 0, graphics.Player.WIDTH, graphics.Player.HEIGHT);
            player.regX = graphics.Player.WIDTH / 2;
            player.regY = graphics.Player.HEIGHT / 2;
            this.players.push(player);
            this.addChild(player);
        }
    };
    Stage.prototype.drawPlayers = function () {
        var width = this._bounds.width;
        var height = this._bounds.height;
        var marginX = 0;
        var marginY = 0;
        var length = this.players.length;
        var rotation = length == 2 ? 0 : 90 * ((length - 1) % 2);

        for (var i in this.players) {
            var player = this.players[i];
            var rad = ((360 / length * i) + rotation) * Math.PI / 180;

            player.x = width / 2 + Math.sin(rad) * ((width - graphics.Player.WIDTH) / 2 - marginX);
            player.y = height / 2 + Math.cos(rad) * ((height - graphics.Player.HEIGHT) / 2 - marginY);
            this.setBounds(player.x, player.y, Player.WIDTH, Player.HEIGHT);
            player.redraw();
        }
    };

    /**
     * DeckUp
     */
    Stage.prototype.addDeckUp = function (cardSet) {
        var scale = 2 / 3;
        var width = 100 * scale * graphics.pixelRatio;
        var height = graphics.Card.HEIGHT * scale * graphics.pixelRatio;

        this.deckUp = new graphics.CardSet(cardSet, scale);
        this.deckUp.setBounds(0, 0, width, height);
        this.addChild(this.deckUp);
    };
    Stage.prototype.drawDeckUp = function () {
        var width_ = this._bounds.width;
        var height_ = this._bounds.height;
        var height = this.deckUp.getBounds().height;

        this.deckUp.x = this._bounds.width / 2 + 15 * graphics.pixelRatio;
        this.deckUp.y = this._bounds.height / 2 - height;
        this.deckUp.redraw();
    };

    /**
     * DeckDown
     */
    Stage.prototype.addDeckDown = function (cardSet) {
        var scale = 2 / 3;
        var width = 100 * scale * graphics.pixelRatio;
        var height = graphics.Card.HEIGHT * scale * graphics.pixelRatio;

        this.deckDown = new graphics.CardSet(cardSet, scale);
        this.deckDown.setBounds(0, 0, width, height);
        this.addChild(this.deckDown);
    };
    Stage.prototype.drawDeckDown = function () {
        var width = this.deckDown.getBounds().width;
        var height = this.deckDown.getBounds().height;

        this.deckDown.x = this._bounds.width / 2 - width - 15 * graphics.pixelRatio;
        this.deckDown.y = this._bounds.height / 2 - height;
        this.deckDown.redraw();
    };

    /**
     * Hand
     */
    Stage.prototype.addHand = function (cardSet) {
        var width = 400 * graphics.pixelRatio;
        var height = 200 * graphics.pixelRatio;

        this.hand = new graphics.Hand(cardSet);
        this.hand.setBounds(0, 0, width, height);
        this.addChild(this.hand);
    };
    Stage.prototype.drawHand = function () {
        var width = this.hand.getBounds().width;
        var height = this.hand.getBounds().height;

        this.hand.x = this._bounds.width / 2 - width / 2;
        this.hand.y = this._bounds.height - height - 25;
        this.hand.redraw();
    };

    /**
     * Table
     */
    Stage.prototype.addTable = function () {
        var color = '#4cae4c';

        this.table = new graphics.Table(color);
        this.addChild(this.table);
    };
    Stage.prototype.drawTable = function () {
        var marginX = 35 * graphics.pixelRatio;
        var marginY = 35 * graphics.pixelRatio;

        this.table.x = marginX;
        this.table.y = marginY;
        this.table.setBounds(marginX, marginY, this._bounds.width - marginX * 2, this._bounds.height - marginY * 2);
        this.table.redraw();
    };

    graphics.Stage = Stage;

}(window.graphics = window.graphics || {}, createjs));