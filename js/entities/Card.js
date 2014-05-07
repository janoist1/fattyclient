/**
 * Card
 * @param type
 * @param value
 * @constructor
 */
function Card(type, value) {

    this.type = type || null;
    this.value = value || null;

    this.toString = function () {
        return this.type + "_" + this.value;
    }
}
