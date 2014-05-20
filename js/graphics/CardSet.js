(function (graphics, createjs, undefined) {

    function CardSet(cardSet, scaleCard) {
        this.initialize(cardSet, scaleCard || 1);
    }

    CardSet.prototype = new createjs.Container();
    CardSet.prototype.parent_initialize = CardSet.prototype.initialize;

    CardSet.prototype.initialize = function (cardSet, scaleCard) {
        this.parent_initialize();

        this.cardSet = cardSet;
        this.cards = [];
        this.mouseChildren = true;
        this.scaleCard = scaleCard;
    };

    CardSet.prototype.redraw = function() {
        this.removeAllChildren();

        var width = this.getBounds().width;
        var length = this.cardSet.cards.length;

        for (var i in this.cardSet.cards) {
            var card = new graphics.Card(this.cardSet.cards[i]);
            card.scale = this.scaleCard;
            card.scaleX = this.scaleCard;
            card.scaleY = this.scaleCard;
            card.x = Math.min(
                card.getBounds().width * this.scaleCard,
                Math.max((width - card.getBounds().width * this.scaleCard) / (length - 1), 0)
            ) * i;

            this.cards.push(card);
            this.addChild(card);
        }
    };

    graphics.CardSet = CardSet;

}(window.graphics = window.graphics || {}, createjs));