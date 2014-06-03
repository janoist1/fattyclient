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
     * @param playerId
     * @returns {Player}
     */
    this.getPlayerById = function (playerId) {
        return _.findWhere(this.players, { id: playerId });
    };

    /**
     * Adds a Player
     *
     * @param player
     */
    this.addPlayer = function (player) {
        this.players.push(player);
    };

    /**
     * Removes a Player by its ID
     *
     * @param playerId
     */
    this.removePlayerById = function (playerId) {
        this.players.filter(function(player) {
            return player.id != playerId
        });
    };

    /**
     * Resets the internals of the Table
     */
    this.reset = function () {
        this.isReady = false;
        this.players = [];
    };
}