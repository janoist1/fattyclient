/**
 * CardSet
 * @param cards
 * @constructor
 */
function CardSet(cards) {

    this.cards = cards || [];

    /**
     * Returns an array of Card IDs
     *
     * @returns {Array}
     */
    this.getIds = function () {
        var ids = [];
        for (var i in this.cards) {
            ids.push(this.cards[i].getId());
        }
        return ids;
    };

    /**
     * Fills up from the given IDs
     *
     * @param ids
     */
    this.fromIds = function (ids) {
        this.cards = [];
        for (var i in ids) {
            var card = new Card();
            card.fromId(ids[i]);
            this.cards.push(card);
        }
    };

    /**
     * Adds a Card
     *
     * @param card
     */
    this.add = function (card) {
        this.cards.push(card);
    };

    /**
     * Removes a Card
     *
     * @param card
     */
    this.remove = function (card) {
        this.cards = _.without(this.cards, card);
    };

    /**
     * Removes all Cards
     */
    this.removeAll = function () {
        this.cards = [];
    };
}
