'use strict';

damFattyServices.factory('Game', ['Auth', 'Client',
    function (Auth, Client) {

        var callbacks = {};

        function fireEvent(event, context, args) {
            if (event in callbacks) {
                callbacks[event].apply(context, args);
            }
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
            this.players = null;
            this.tableId = null;
            this.tables = null;
            this.deckUp = null;
            this.deckDown = null;
            this.isSwapDone = false;


            /**
             * Returns the current/active player
             *
             * @type {function(this:Game)|*}
             */
            this.getPlayer = function () {
                return this.getPlayerById(this.playerId);
            }.bind(this);

            /**
             * Returns the current/active player with its cards
             *
             * @type {function(this:Game)|*}
             */
            this.getTablePlayer = function () {
                return _.findWhere(this.getTable().players, {player_id: this.playerId});
            }.bind(this);

            /**
             * Returns a player by its ID
             *
             * @type {function(this:Game)|*}
             */
            this.getPlayerById = function (playerId) {
                return _.findWhere(this.players, { player_id: playerId });
            }.bind(this);

            /**
             * Returns the current/active table
             *
             * @type {function(this:Game)|*}
             */
            this.getTable = function () {
                return this.getTableByPlayerId(this.playerId);
            }.bind(this);

            /**
             * Returns a table by its ID
             *
             * @param tableId
             * @type {function(this:Game)|*}
             */
            this.getTableById = function (tableId) {
                return _.findWhere(this.tables, {table_id: tableId});
            }.bind(this);

            /**
             * Returns a table by a player ID
             *
             * @param playerId
             * @type {function(this:Game)|*}
             */
            this.getTableByPlayerId = function (playerId) {
                var tableRet = null;

                _.each(this.tables, function (table) {
                    _.each(table.players, function (player) {
                        if (player.player_id == playerId) {
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
                var player = this.getTablePlayer();

                switch (true) {
                    case player === undefined:
                        return null;
                    case player.cards_hand.length > 0:
                        return player.cards_hand;
                    case player.cards_up.length > 0:
                        return player.cards_up;
                    default:
                        return player.cards_down;
                }
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
                if (!_.findWhere(table.players, {player_id: this.playerId})) {
                    Client.send(Client.PACKET.SIT_DOWN, {
                        table_id: table.table_id
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
                var player = this.getTablePlayer();

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
                var player = this.getTablePlayer();
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
                this.tables = data;

                fireEvent(this.EVENT.TABLE_CHANGE, this);
            }.bind(this));

            Client.on(Client.PACKET.PLAYERS_LIST, function (data) {
                this.players = data;

                fireEvent(this.EVENT.PLAYER_CHANGE, this);
                fireEvent(this.EVENT.LOAD, this);
            }.bind(this));

            Client.on(Client.PACKET.NEW_PLAYER, function (data) {
                this.players.push(data);

                fireEvent(this.EVENT.PLAYER_CHANGE, this);
            }.bind(this));

            Client.on(Client.PACKET.NEW_TABLE, function (data) {
                this.tables.push(data);

                fireEvent(this.EVENT.TABLE_CHANGE, this);
            }.bind(this));

            Client.on(Client.PACKET.TABLE_CLOSED, function (data) {
                this.tables = _.without(
                    this.tables,
                    _.findWhere(this.tables, { table_id: data.table_id })
                );

                fireEvent(this.EVENT.TABLE_CHANGE, this);
            }.bind(this));

            Client.on(Client.PACKET.SIT_DOWN, function (data) {
                var table = this.getTableById(data.table_id);
                table.players.push({
                    player_id: data.player_id,
                    is_ready: false
                });

                fireEvent(this.EVENT.TABLE_CHANGE, this);
            }.bind(this));

            Client.on(Client.PACKET.GATHERING, function (data) {
                this.isLoading = false;
                this.tableId = data.table_id;

                fireEvent(this.EVENT.GATHERING, this, [data.table_id]);
            }.bind(this));

            Client.on(Client.PACKET.PLAYER_READY, function (data) {
                _.each(this.tables, function (table) {
                    _.each(table.players, function (player) {
                        if (player.player_id == data.player_id) {
                            player.is_ready = true;
                        }
                    });
                });

                fireEvent(this.EVENT.TABLE_CHANGE, this);
            }.bind(this));

            Client.on(Client.PACKET.TABLE_READY, function (data) {
                fireEvent(this.EVENT.TABLE_READY, this);
            }.bind(this));

            Client.on(Client.PACKET.GAME_START, function (data) {
                var table = this.getTable();

                _.each(data.cards, function (cards, playerId) {
                    _.each(table.players, function (item) {
                        if (item.player_id == playerId) {
                            item.cards_hand = cards.cards_hand
                            item.cards_up = cards.cards_up
                            item.cards_down = cards.cards_down
                        }
                    });
                });

                fireEvent(this.EVENT.GAME_START, this);
            }.bind(this));

            Client.on(Client.PACKET.PLAYER_NOT_READY, function (data) {
                _.each(this.tables, function (table) {
                    _.each(table.players, function (player) {
                        if (player.player_id == data.player_id) {
                            player.is_ready = false;
                        }
                    });
                });

                fireEvent(this.EVENT.TABLE_CHANGE, this);
            }.bind(this));

            Client.on(Client.PACKET.SWAP, function (data) {
                _.each(this.tables, function (table) {
                    _.each(table.players, function (player) {
                        if (player.player_id == data.player_id) {
                            player.cards_up = data.cards_up;
                        }
                    });
                });

                fireEvent(this.EVENT.TABLE_CHANGE, this);
            }.bind(this));

            Client.on(Client.PACKET.SWAP_DONE, function (data) {
            }.bind(this));

            Client.on(Client.PACKET.PLAYER_LEFT_TABLE, function (data) {
                // is the table ready ?
                var isReady = true;
                _.each(this.tables, function (table) {
                    if (table.players.length <= 1) {
                        isReady = false;
                    } else if (isReady) {
                        _.each(table.players, function (player) {
                            if (isReady && !player.is_ready) {
                                isReady = false;
                            }
                        });
                    }
                });

                if (data.player_id == this.playerId) {
                    this.tableId = null;
                }

                if (isReady) {
                    // game already started, notice user left
                } else {
                    // game hasn't started yet, simply remove the user
                    _.each(this.tables, function (table) {
                        table.players = _.reject(table.players, function (player) {
                            if (player.player_id == data.player_id) {
                                return true;
                            }
                        });
                    });
                }

                fireEvent(this.EVENT.TABLE_CHANGE, this);
            }.bind(this));
        }

        return new Game();
    }]
);