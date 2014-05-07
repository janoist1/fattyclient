/**
 * Table
 * @param id
 * @param name
 * @param isReady
 * @constructor
 */
function Table(id, name, isReady) {

    this.id = id || null;
    this.name = name || null;
    this.isReady = isReady || false;
    this.players = [];

    /**
     * Returns a Player with the given ID
     *
     * @type {function(this:Table)|*}
     * @param playerId
     * @returns {Player}
     */
    this.getPlayerById = function (playerId) {
        return _.findWhere(this.players, { id: playerId });
    }.bind(this);

    /**
     *
     * @type {function(this:Table)|*}
     */
    this.addPlayer = function (player) {
        this.players.push(player);
    }.bind(this);

    /**
     *
     * @type {function(this:Table)|*}
     */
    this.removePlayerById = function (playerId) {
        this.players.pop(player);
    }.bind(this);
}