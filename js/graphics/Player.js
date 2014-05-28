(function (graphics, createjs, undefined) {

    function Player(player, hideHand) {
        this.initialize(player, hideHand || false);
    }

    Player.prototype = new createjs.Container();
    Player.prototype.parent_initialize = Player.prototype.initialize;

    Player.WIDTH = 108 * graphics.pixelRatio;
    Player.HEIGHT = 90 * graphics.pixelRatio;

    Player.prototype.initialize = function (player, hideHand) {
        this.parent_initialize();

        this.player = player;
        this.shadow = new createjs.Shadow("rgba(0,0,0,1.0)", 0, 0, 5);
        this.mouseChildren = false;

        this.text = new createjs.Text(player.name, "bold " + (12 * graphics.pixelRatio) + "px Arial", "#FFF");
        this.text.x = Player.WIDTH / 2 - this.text.getMeasuredWidth() / 2;
        this.text.y = 0;
        this.addChild(this.text);

        var scale = 1 / 2;

        this.cardsDown = new graphics.CardSet(player.cardsDown, scale);
        this.cardsDown.y = Player.HEIGHT - graphics.Card.HEIGHT;
        this.cardsDown.setBounds(0, this.cardsDown.y, Player.WIDTH, Player.HEIGHT);
        this.addChild(this.cardsDown);

        this.cardsUp = new graphics.CardSet(player.cardsUp, scale);
        this.cardsUp.y = Player.HEIGHT - graphics.Card.HEIGHT * 1.2;
        this.cardsUp.setBounds(0, this.cardsUp.y, Player.WIDTH, Player.HEIGHT);
        this.addChild(this.cardsUp);

        if (hideHand !== true) {
            this.cardsHand = new graphics.CardSet(player.cardsHand, scale);
            this.cardsHand.y = Player.HEIGHT - graphics.Card.HEIGHT * 1.5;
            this.cardsHand.setBounds(0, this.cardsHand.y, Player.WIDTH, Player.HEIGHT);
            this.addChild(this.cardsHand);
        } else {
            this.cardsHand = null;
        }
    };

    Player.prototype.redraw = function() {
        this.cardsDown.redraw();
        this.cardsUp.redraw();
        if (this.cardsHand != null) {
            this.cardsHand.redraw();
        }

        this.text.color = this.player.isActive ? 'red' : 'white';
    };

    graphics.Player = Player;

}(window.graphics = window.graphics || {}, createjs));