'use strict';

damFattyServices.factory('Client', [function () {
    var EVENT = {
        CONNECTED: 'CONNECTED',
        DISCONNECTED: 'DISCONNECTED',
        ERROR: 'ERROR'
    };
    var PACKET = {
        WELCOME: 0,
        LOGIN: 1,
        PLAYERS_LIST: 9,
        TABLES_LIST: 12,
        SIT_DOWN: 13,
        GATHERING: 2,
        PLAYER_READY: 11,
        PLAYER_NOT_READY: 21,
        SWAP: 15,
        SWAP_DONE: 16,
        NEW_PLAYER: 3,
        NEW_TABLE: 22,
        GAME_START: 4,
        PUT_CARD: 6,
        PLAYER_WON: 7,
        GAME_END: 8,
        CHAT_MESSAGE: 10,
        TURN: 17,
        PLAYER_LEFT: 14,
        PLAYER_LEFT_TABLE: 18,
        GAME_ERROR: 19,
        TABLE_READY: 20,
        TABLE_CLOSED: 23
    };

    var connection = null;
    var isConnected = false;
    var callbacks = {};

    function getPacketName(value) {
        for (var key in PACKET) {
            if (PACKET[key] == value) {
                return key;
            }
        }
        return null;
    }

    function log(s, o) {
        window.console.log('Client.' + s, o);
    }

    function connect() {
        log('connect', config.fattyServer.url);

        connection = new WebSocket(config.fattyServer.url);
        connection.onopen = onOpen;
        connection.onmessage = onMessage;
        connection.onclose = onClose;
        connection.onerror = onError;
    }

    function send(packet) {
        log('send --> ' + getPacketName(packet.type), packet);
        connection.send(JSON.stringify(packet));
    }

    function onOpen(e) {
        isConnected = true;
        if (EVENT.CONNECTED in callbacks) {
            callbacks[EVENT.CONNECTED](e);
        }
    }

    function onMessage(e) {
        var packet = $.parseJSON(e.data);

        log('recv <-- ' + getPacketName(packet.type), packet);

        if (packet.type in callbacks) {
            callbacks[packet.type](packet.data);
        } else {
            log('message', 'unknown packet')
        }
    }

    function onClose(e) {
        if (EVENT.DISCONNECTED in callbacks) {
            callbacks[EVENT.DISCONNECTED](e);
        }
    }

    function onError(e) {
        if (EVENT.ERROR in callbacks) {
            callbacks[EVENT.ERROR](e);
        }
    }

    return {

        EVENT: EVENT,
        PACKET: PACKET,

        isConnected: function () {
            return isConnected;
        },

        connect: function () {
            connect();
        },

        on: function (type, callback) {
            callbacks[type] = function () {
                callback.apply(this, arguments);
            };
        },

        send: function (type, data) {
            var packet = {
                type: type,
                data: data
            };
            send(packet);
        }
    };
}]);
