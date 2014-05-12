/**
 * Card
 * @param type
 * @param value
 * @constructor
 */
function Card(type, value) {

    this.type = type || null;
    this.value = value || null;

    this.getId = function () {
        return this.type + "_" + this.value;
    }

    this.fromId = function (id) {
        var card = id.split('_');
        this.type = card[0];
        this.value = card[1];
    }

    this.toString = function () {
        return this.getId();
    }
}
