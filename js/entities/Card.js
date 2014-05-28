/**
 * Card
 * @param type
 * @param value
 * @constructor
 */
function Card(type, value) {

    this.type = type || 0;
    this.value = value || 0;

    /**
     * Returns the ID of the Card
     *
     * @returns {string}
     */
    this.getId = function () {
        return this.type + "_" + this.value;
    };

    /**
     * Sets the type and the value from the given ID
     *
     * @param id
     */
    this.fromId = function (id) {
        var card = id.split('_');
        this.type = card[0];
        this.value = card[1];
    };

    /**
     * Converts to string format
     *
     * @returns {string}
     */
    this.toString = function () {
        return this.getId();
    };
}
