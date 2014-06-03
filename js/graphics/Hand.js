(function (graphics, createjs, undefined) {

    function Hand(cardSet) {
        this.initialize(cardSet);
//        createjs.EventDispatcher.initialize(Hand.prototype);
    }

    Hand.prototype = new createjs.Container();
    Hand.prototype.parent_initialize = Hand.prototype.initialize;

    Hand.prototype.initialize = function (cardSet) {
        this.parent_initialize();

        this.cardSet = cardSet;
        this.cards = [];
        this.highlights = [];
        this.shadow = new createjs.Shadow("rgba(0,0,0,0.25)", 5, 5, 15);
    };

    Hand.prototype.redraw = function() {
        this.removeAllChildren();

        var width = this.getBounds().width;
        var height = this.getBounds().height;
        var length = this.cardSet.cards.length;

        for (var i in this.cardSet.cards) {
            var card = new graphics.Card(this.cardSet.cards[i]);
            var range = Math.min((length - 1) * 5, 85);
            var rotation = range / -2 + (range / (Math.max(1, length - 1)) * i);
            var rad = rotation * Math.PI / 180;
            var h = height * 2;
            var highlight = this.isHighlight(this.cardSet.cards[i]) ? 1.05 : 1;

            card.x = width / 2 + Math.sin(rad) * ((width / 2 + graphics.Card.WIDTH / 2)) * highlight;
            card.y = h - Math.cos(rad) * ((h - graphics.Card.HEIGHT)) * highlight;
            card.regX = graphics.Card.WIDTH;
            card.regY = graphics.Card.HEIGHT;
            card.rotation = rotation;

            this.cards.push(card);
            this.addChild(card);
        }
    }

    Hand.prototype.highlight = function (card) {
        if (!this.isHighlight(card)) {
            this.highlights.push(card);
        }
    };

    Hand.prototype.unHighlight = function (card) {
        this.highlights = _.without(this.highlights, card);
    };

    Hand.prototype.isHighlight = function (card) {
        return _.contains(this.highlights, card);
    };

    graphics.Hand = Hand;

}(window.graphics = window.graphics || {}, createjs));