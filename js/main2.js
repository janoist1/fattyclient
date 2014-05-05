var MSG_WELCOME = 0;
var MSG_LOGIN = 1;
var MSG_PLAYERS_LIST = 9;
var MSG_TABLES_LIST = 12;
var MSG_SIT_DOWN = 13;
var MSG_TABLE_PLAYERS_LIST = 14;
var MSG_GATHERING = 2;
var MSG_PLAYER_READY = 11;
var MSG_SWAP = 15;
var MSG_SWAP_DONE = 16;
var MSG_NEW_PLAYER = 3;
var MSG_GAME_START = 4;
var MSG_PUT_CARD = 6;
var MSG_PLAYER_WON = 7;
var MSG_GAME_END = 8;
var MSG_CHAT_MESSAGE = 10;
var MSG_TURN = 17;

var conn = null;

$(function () {
    var console = $('#console');
    var types = [
        'WELCOME',
        'LOGIN',
        'GATHERING',
        'NEW_PLAYER',
        'GAME_START',
        '', // 5
        'PUT_CARD',
        'PLAYER_WON',
        'GAME_END',
        'PLAYERS_LIST',
        'CHAT_MESSAGE', // 10
        'PLAYER_READY',
        'TABLES_LIST',
        'SIT_DOWN',
        'TABLE_PLAYERS_LIST',
        'MSG_SWAP', // 15
        'MSG_SWAP_DONE',
        'MSG_TURN'
    ];

    function send(o) {
        var s = JSON.stringify(o);
        log('--> ' + types[o.type] + " - " + s);
        conn.send(s);
    }

    function log(s) {
        console.val(console.val() + s + "\n");
    }

    var user_id;

    conn = new WebSocket('ws://localhost:9991');

    conn.onopen = function (e) {
        window.console.log("Connection established!");
    };

    conn.onmessage = function (e) {
        window.console.log(e.data);

        var packet = jQuery.parseJSON(e.data);

        switch (packet.type) {
            case MSG_WELCOME:
                user_id = packet.data.id;
                $('.game-panel .user_id').html(user_id);
                break;

            case MSG_LOGIN:
                break;

            case MSG_TABLES_LIST:
                $('#table_id').val(packet.data[0].id);
                break;

            case MSG_GAME_START:
                $.each(['hand','up','down'], function(i,cardStorage) {
                    $.each(packet.data.cards[user_id]['cards_' + cardStorage], function(i,o) {
                        $('.game-panel .cards .' + cardStorage).append(
                            $('<input type="button" />').val(o).click(function() {
                                $('#card').val($('#card').val() + ',' + o)
                            })
                        );
                    });
                });

                $('#cards_up').val(JSON.stringify(packet.data.cards[user_id].cards_hand));
                break;
        }

        log('<-- ' + types[packet.type] + " - " + e.data);
    };

    $('#login').click(function () {
        var name = $('#name').val();
        $('.game-panel .user_name').html(name);
        send({
            "type": MSG_LOGIN,
            "data": {
                "name": $('#name').val()
            }
        });
    });
    $('#sit_down').click(function () {
        send({
            "type": MSG_SIT_DOWN,
            "data": {
                "table_id": $('#table_id').val()
            }
        });
    });
    $('#ready').click(function () {
        send({
            "type": MSG_PLAYER_READY
        });
    });
    $('#swap').click(function () {
        send({
            "type": MSG_SWAP,
            "data": {
                "cards_up": jQuery.parseJSON($('#cards_up').val())
            }
        });
    });
    $('#put_card').click(function () {
        send({
            "type": MSG_PUT_CARD,
            "data": {
                "card": $('#card').val(),
                "variants": ''
            }
        });
    });
});