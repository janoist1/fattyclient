'use strict';

damFattyServices.factory('Game', ['Auth', 'Client',
    function (Auth, Client) {

        var callbacks = {};

        function fireEvent(event, context, args) {
            if (event in callbacks) {
                callbacks[event].apply(context, args);
            }
        }

        function convertCards(cards) {
            var cardObjects = [];

            for (var i in cards) {
                var card = new Card(
                    cards[i].type,
                    cards[i].value
                );
                cardObjects.push(card)
            }

            return cardObjects;
        }

        function Game() {
            this.EVENT = {
                LOAD: 'load',
                GATHERING: 'gathering',
                PLAYER_CHANGE: 'player_change',
                TABLE_CHANGE: 'table_change',
                TABLE_READY: 'table_ready',
                GAME_START: 'game_start'
            };

            this.playerId = null;
            this.players = [];
            this.tableId = null;
            this.tables = [];
            this.deckUp = null;
            this.deckDown = null;
            this.isSwapDone = false;

            /**
             * Returns the current/active Player
             *
             * @type {function(this:Game)|*}
             */
            this.getPlayer = function () {
                return this.getPlayerById(this.playerId);
            }.bind(this);

            /**
             * Returns a Player by its ID
             *
             * @type {function(this:Game)|*}
             */
            this.getPlayerById = function (playerId) {
                return _.findWhere(this.players, { id: playerId });
            }.bind(this);

            /**
             * Adds a Player
             *
             * @param player
             * @type {function(this:Game)|*}
             */
            this.addTable = function (player) {
                this.players.push(player);
            }.bind(this);

            /**
             * Removes a Player by its ID
             *
             * @param tableId
             * @type {function(this:Game)|*}
             */
            this.removeTableById = function (playerId) {
                this.players = _.without(this.tables, this.getTableById(playerId));
            }.bind(this);

            /**
             * Returns the current/active Table
             *
             * @type {function(this:Game)|*}
             */
            this.getTable = function () {
                return this.getTableByPlayerId(this.playerId);
            }.bind(this);

            /**
             * Returns a Table by its ID
             *
             * @param tableId
             * @type {function(this:Game)|*}
             */
            this.getTableById = function (tableId) {
                return _.findWhere(this.tables, {id: tableId});
            }.bind(this);

            /**
             * Adds a Table
             *
             * @param table
             * @type {function(this:Game)|*}
             */
            this.addTable = function (table) {
                this.tables.push(table);
            }.bind(this);

            /**
             * Removes a Table by its ID
             *
             * @param tableId
             * @type {function(this:Game)|*}
             */
            this.removeTableById = function (tableId) {
                this.tables = _.without(this.tables, this.getTableById(tableId));
            }.bind(this);

            /**
             * Returns a Table by a player ID
             *
             * @param playerId
             * @type {function(this:Game)|*}
             */
            this.getTableByPlayerId = function (playerId) {
                var tableRet = null;

                _.each(this.tables, function (table) {
                    _.each(table.players, function (player) {
                        if (player.id == playerId) {
                            tableRet = table;
                        }
                    });
                });

                return tableRet;
            }.bind(this);

            /**
             * Returns the cards available to put
             *
             * @type {function(this:Game)|*}
             */
            this.getAvailableCards = function () {
                var player = this.getPlayer();

                return player ? player.getAvailableCards() : null;
            }.bind(this);

            /**
             * Adds a function to event listener
             *
             * @param type
             * @param callback
             * @type {function(this:Game)|*}
             */
            this.on = function (type, callback) {
                callbacks[type] = function () {
                    var args = arguments;
                    callback.apply(this, arguments);
//                    $rootScope.$apply(function () {
//                        callback.apply(this, args);
//                    });
                };
            }.bind(this);

            /**
             * Sends a newTable packet
             *
             * @param name
             * @type {function(this:Game)|*}
             */
            this.newTable = function (name) {
                Client.send(Client.PACKET.NEW_TABLE, {
                    name: name
                });
            }.bind(this);

            /**
             * Sits the player at table
             * and sends a sitDown packet
             *
             * @param tableId
             * @type {function(this:Game)|*}
             */
            this.sitDown = function (tableId) {
                this.tableId = tableId;

                var table = this.getTableById(tableId);
                if (!table.getPlayerById(this.playerId)) {
                    Client.send(Client.PACKET.SIT_DOWN, {
                        table_id: table.id
                    });
                }
            }.bind(this);

            /**
             * Sets the player ready
             * and sends a playerReady packet
             *
             * @type {function(this:Game)|*}
             */
            this.ready = function () {
                if (!this.isReady) {
                    Client.send(Client.PACKET.PLAYER_READY, {});

                    this.isReady = true;
                }
            }.bind(this);

            /**
             * Sets the player not ready
             * and sends a playerNotReady packet
             *
             * @type {function(this:Game)|*}
             */
            this.notReady = function () {
                if (this.isReady) {
                    Client.send(Client.PACKET.PLAYER_NOT_READY, {});

                    this.isReady = false;
                }
            }.bind(this);

            /**
             * Makes player leave current table
             * @type {function(this:Game)|*}
             */
            this.leaveTable = function () {
                Client.send(Client.PACKET.PLAYER_LEFT_TABLE, {});

                this.isReady = false;
            }.bind(this);

            /**
             * Swaps cardToHand with cardToUp
             *
             * @param cardToHand
             * @param cardToUp
             * @type {function(this:Game)|*}
             */
            this.swap = function (cardToHand, cardToUp) {
                var player = this.getPlayer();

                player.cards_hand = _.without(player.cards_hand, cardToUp);
                player.cards_hand.push(cardToHand);
                player.cards_up = _.without(player.cards_up, cardToHand);
                player.cards_up.push(cardToUp);
            }.bind(this);

            /**
             * Sends a swapDone packet
             *
             * @type {function(this:Game)|*}
             */
            this.swapDone = function () {
                var player = this.getPlayer();
                Client.send(Client.PACKET.SWAP, {
                    cards_up: player.cards_up
                });

                this.initDeckDown();

                this.isSwapDone = true;
            }.bind(this);

            /**
             * Initialises the deckDown
             *
             * @type {function(this:Game)|*}
             */
            this.initDeckDown = function () {
                this.deckDown = [];

                for (var i = 0; i < 52 - this.players.length * 9; i++) {
                    this.deckDown.push('0_' + i);
                }
            }.bind(this);


            /**
             * Hooking up listeners
             */

            Client.on(Client.PACKET.WELCOME, function (data) {
                this.playerId = data.id;

                Client.send(Client.PACKET.LOGIN, {
                    name: Auth.user.name
                });
            }.bind(this));

            Client.on(Client.PACKET.LOGIN, function (data) {
            }.bind(this));

            Client.on(Client.PACKET.TABLES_LIST, function (data) {
                for (var i in data) {
                    var table = new Table(
                        data[i].table_id,
                        data[i].name,
                        data[i].is_ready
                    );
                    this.addTable(table);
                }

                fireEvent(this.EVENT.TABLE_CHANGE, this);
            }.bind(this));

            Client.on(Client.PACKET.PLAYERS_LIST, function (data) {
                for (var i in data) {
                    var player = new Player(
                        data[i].player_id,
                        data[i].name,
                        false
                    );
                    this.addPlayer(player);
                }

                fireEvent(this.EVENT.PLAYER_CHANGE, this);
                fireEvent(this.EVENT.LOAD, this);
            }.bind(this));

            Client.on(Client.PACKET.NEW_PLAYER, function (data) {
                var player = new Player(
                    data.player_id,
                    data.name,
                    false
                );
                this.addPlayer(player);

                fireEvent(this.EVENT.PLAYER_CHANGE, this);
            }.bind(this));

            Client.on(Client.PACKET.NEW_TABLE, function (data) {
                var table = new Table(
                    data.table_id,
                    data.name,
                    data.is_ready
                );
                this.addTable(table);

                fireEvent(this.EVENT.TABLE_CHANGE, this);
            }.bind(this));

            Client.on(Client.PACKET.TABLE_CLOSED, function (data) {
                this.removeTableById(data.table_id);

                fireEvent(this.EVENT.TABLE_CHANGE, this);
            }.bind(this));

            Client.on(Client.PACKET.SIT_DOWN, function (data) {
                var table = this.getTableById(data.table_id);
                var player = this.getPlayerById(data.player_id);

                table.addPlayer(player);

                fireEvent(this.EVENT.TABLE_CHANGE, this);
            }.bind(this));

            Client.on(Client.PACKET.GATHERING, function (data) {
                this.isLoading = false;
                this.tableId = data.table_id;

                fireEvent(this.EVENT.GATHERING, this, [data.table_id]);
            }.bind(this));

            Client.on(Client.PACKET.PLAYER_READY, function (data) {
                this.getPlayerById(data.player_id).isReady = true;

                fireEvent(this.EVENT.TABLE_CHANGE, this);
            }.bind(this));

            Client.on(Client.PACKET.PLAYER_NOT_READY, function (data) {
                this.getPlayerById(data.player_id).isReady = false;

                fireEvent(this.EVENT.TABLE_CHANGE, this);
            }.bind(this));

            Client.on(Client.PACKET.TABLE_READY, function (data) {
                this.getTableById(data.table_id).isReady = true;

                fireEvent(this.EVENT.TABLE_READY, this);
            }.bind(this));

            Client.on(Client.PACKET.GAME_START, function (data) {
                for (var playerId in data.cards) {
                    var player = this.getPlayerById(playerId);

                    player.carsHand = convertCards(data.cards[playerId].cards_hand);
                    player.carsUp = convertCards(data.cards[playerId].cards_up);
                    player.carsDown = convertCards(data.cards[playerId].cards_down);
                }


                fireEvent(this.EVENT.TABLE_CHANGE, this);
            }.bind(this));

            Client.on(Client.PACKET.SWAP, function (data) {
                this.getPlayerById(data.player_id).cards_up = data.cards_up;

                fireEvent(this.EVENT.TABLE_CHANGE, this);
            }.bind(this));

            Client.on(Client.PACKET.SWAP_DONE, function (data) {
            }.bind(this));

            Client.on(Client.PACKET.PLAYER_LEFT_TABLE, function (data) {
                if (data.player_id == this.playerId) {
                    this.tableId = null;
                    this.isReady = false;
                    this.isStarted = false;
                    this.isSwapDone = false;
                    this.deckDown = null;
                    this.deckUp = null;
                }

                this.getPlayerById(data.player_id).isReady = false;

                var table = this.getTableByPlayerId(data.player_id);
                if (table.isReady) {
                    // game already started, notice user left
                } else {
                    // game hasn't started yet, simply remove the user
                    table.removePlayerById(data.player_id);
                }

                fireEvent(this.EVENT.TABLE_CHANGE, this);
            }.bind(this));
        }

        return new Game();
    }]
);