(function (graphics, createjs, undefined) {

    function Card(card) {
        this.initialize(card);
    }

    Card.prototype = new createjs.Container();
    Card.prototype.parent_initialize = Card.prototype.initialize;

    Card.WIDTH = 72;
    Card.HEIGHT = 96;

    Card.prototype.initialize = function (card) {
        this.parent_initialize();

        this.card = card;
        this.mouseChildren = false;

        this.bitmap = new createjs.Bitmap("/images/cards" + (graphics.pixelRatio == 2 ? '-retina' : '') + ".png");
        this.bitmap.sourceRect = new createjs.Rectangle(
            Card.WIDTH * graphics.pixelRatio * (card.type == 0 ? 0 : (card.value - 1)),
            Card.HEIGHT * graphics.pixelRatio * card.type,
            Card.WIDTH * graphics.pixelRatio,
            Card.HEIGHT * graphics.pixelRatio
        );
        this.addChild(this.bitmap);

        this.setBounds(0, 0, Card.WIDTH * graphics.pixelRatio, Card.HEIGHT * graphics.pixelRatio);
    };

    graphics.Card = Card;

}(window.graphics = window.graphics || {}, createjs));