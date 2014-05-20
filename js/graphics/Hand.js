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
        this.shadow = new createjs.Shadow("rgba(0,0,0,0.25)", 5, 5, 15);
    };

    Hand.prototype.redraw = function() {
        this.removeAllChildren();

        var width = this.getBounds().width;
        var height = this.getBounds().height;
        var length = this.cardSet.cards.length;

        for (var i in this.cardSet.cards) {
            var card = new graphics.Card(this.cardSet.cards[i]);
            var range = Math.min(length * 5, 85);
            var rotation = range / -2 + (range / (Math.max(1, length - 1)) * i);
            var rad = rotation * Math.PI / 180;
            var h = height * 2;

            card.x = width / 2 + Math.sin(rad) * ((width / 2 + graphics.Card.WIDTH / 2));
            card.y = h - Math.cos(rad) * ((h - graphics.Card.HEIGHT));
            card.regX = graphics.Card.WIDTH;
            card.regY = graphics.Card.HEIGHT;
            card.rotation = rotation;

            this.cards.push(card);
            this.addChild(card);
        }
    }

    graphics.Hand = Hand;

}(window.graphics = window.graphics || {}, createjs));