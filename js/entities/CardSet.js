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
     * Gets a Card by its ID
     *
     * @param id
     */
    this.getById = function (id) {
        for (var i in this.cards) {
            if (this.cards[i].getId() == id) {
                return this.cards[i];
            }
        }
        return null;
    };

    /**
     * Gets a Card at index
     *
     * @param index
     */
    this.getAt = function (index) {
        if (index < 0 || index >= this.count()) {
            return null;
        }
        return this.cards[index];
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
     * Removes a Card by its ID
     *
     * @param id
     */
    this.removeById = function (id) {
        this.remove(this.getById(id));
    };

    /**
     * Removes a Card at index
     *
     * @param index
     */
    this.removeAt = function (index) {
        this.cards.splice(index, 1);
    };

    /**
     * Removes all Cards
     */
    this.removeAll = function () {
        this.cards = [];
    };

    /**
     * Counts the cards
     */
    this.count = function () {
        return this.cards.length;
    };

    /**
     * Reorders the cards ASC
     */
    this.reorder = function() {
        this.cards = _.sortBy(this.cards, function(card) {
            return card.value;
        });
    };
}
