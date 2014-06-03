/**
 * Player
 * @param id
 * @param name
 * @param isReady
 * @param isActive
 * @constructor
 */
function Player(id, name, isReady, isActive) {

    this.id = id || null;
    this.name = name || null;
    this.isReady = isReady || false;
    this.isActive = isActive || false;
    this.cardsHand = new CardSet();
    this.cardsUp = new CardSet();
    this.cardsDown = new CardSet();
}