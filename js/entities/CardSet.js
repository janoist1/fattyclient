/**
 * CardSet
 * @param cards
 * @constructor
 */
function CardSet(cards) {

    this.cards = cards || [];

    this.getIds = function () {
        var ids = [];
        for (var i in this.cards) {
            ids.push(this.cards[i].getId());
        }
        return ids;
    };

    this.fromIds = function (ids) {
        this.cards = [];
        for (var i in ids) {
            var card = new Card();
            card.fromId(ids[i]);
            this.cards.push(card);
        }
    };

    this.add = function (card) {
        this.cards.push(card);
    };

    this.remove = function (card) {
        this.cards = _.without(this.cards, card);
    };
}
