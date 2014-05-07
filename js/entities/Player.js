/**
 * Player
 * @param id
 * @param name
 * @param isReady
 * @constructor
 */
function Player(id, name, isReady) {

    this.id = id || null;
    this.name = name || null;
    this.isReady = isReady || false;
    this.cardsHand = [];
    this.cardsUp = [];
    this.cardsDown = [];

    /**
     * Returns the cards available to put
     *
     * @type {function(this:Player)|*}
     */
    this.getAvailableCards = function () {
        switch (true) {
            case this.cardsHand.length > 0:
                return this.cardsHand;
            case this.cardsUp.length > 0:
                return this.cardsUp;
            default:
                return this.cardsDown;
        }
    }.bind(this);
}