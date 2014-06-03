'use strict';

damFattyServices.factory('Game', ['Auth', 'Client',
    function (Auth, Client) {

        var callbacks = {};

        function fireEvent(type, context, args) {
            if (type in callbacks) {
                for (var i in callbacks[type]) {
                    callbacks[type][i].apply(context, args);
                }
            }
        }

        function Game() {
            this.EVENT = {
                LOAD: 'load',
                GATHERING: 'gathering',
                PLAYER_CHANGE: 'player_change',
                TABLE_CHANGE: 'table_change',
                TABLE_READY: 'table_ready',
                GAME_START: 'game_start',
                SWAP_DONE: 'swap_done',
                TURN: 'turn'
            };

            this.playerId = null;
            this.players = [];
            this.tableId = null;
            this.tables = [];
            this.deckUp = new CardSet();
            this.deckDown = new CardSet();
            this.isReady = false;
            this.isStarted = false;
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
             * Returns a Player by its ID
             *
             * @type {function(this:Game)|*}
             */
            this.getActivePlayer = function () {
                return _.findWhere(this.players, { isActive: true });
            }.bind(this);

            /**
             * Adds a Player
             *
             * @param player
             * @type {function(this:Game)|*}
             */
            this.addPlayer = function (player) {
                this.players.push(player);
            }.bind(this);

            /**
             * Removes a Player by its ID
             *
             * @param tableId
             * @type {function(this:Game)|*}
             */
            this.removePlayerById = function (playerId) {
                this.players = _.without(this.players, this.getPlayerById(playerId));
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
            this.initTable = function (table) {
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
                for (var i in this.tables) {
                    if (this.tables[i].getPlayerById(playerId)) {
                        return this.tables[i];
                    }
                }
                return null;
            }.bind(this);

            /**
             * Returns the cards available to put
             *
             * @type {function(this:Game)|*}
             */
            this.getAvailableCardSet = function () {
                var player = this.getPlayer();

                return player ? player.getAvailableCardSet() : null;
            }.bind(this);

            /**
             * Adds a function to event listener
             *
             * @param type
             * @param callback
             * @type {function(this:Game)|*}
             */
            this.on = function (type, callback) {
                if (!(type in callbacks)) {
                    callbacks[type] = [];
                }
                callbacks[type].push(function () {
                    var args = arguments;
                    callback.apply(this, arguments);
                });
            }.bind(this);

            /**
             * Removes a function from event listener
             *
             * @param type
             * @param callback
             * @type {function(this:Game)|*}
             */
            this.off = function (type, callback) {
                if (!(type in callbacks)) {
                    return;
                }
                for (var i in callbacks[type]) {
                    if(callbacks[type][i] == callback) {
                        callbacks[type].splice(i,1);
                        return;
                    }
                }
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

                player.cardsHand.remove(cardToUp);
                player.cardsHand.add(cardToHand);
                player.cardsUp.remove(cardToHand);
                player.cardsUp.add(cardToUp);
            }.bind(this);

            /**
             * Sends a swapDone packet
             *
             * @type {function(this:Game)|*}
             */
            this.swapDone = function () {
                var player = this.getPlayer();
                Client.send(Client.PACKET.SWAP, {
                    cards_up: player.cardsUp.getIds()
                });

                this.initDeckDown();

                this.isSwapDone = true;
            }.bind(this);

            /**
             * Makes a turn
             *
             * @param cardSet
             * @param player
             */
            this.turn = function (cardSet, player) {
                var data = {
                    cards: cardSet.getIds()
                };

                if (player) {
                    data.player_id = player.id;
                }

                Client.send(Client.PACKET.TURN, data);
            }.bind(this);

            /**
             * Initialises the deckDown
             *
             * @type {function(this:Game)|*}
             */
            this.initDeckDown = function () {
                for (var i = 0; i < 52 - this.players.length * 9; i++) {
                    this.deckDown.add(new Card('0', i + 1));
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

            Client.on(Client.PACKET.PLAYERS_LIST, function (data) {
                for (var i in data) {
                    var player = new Player(
                        data[i].player_id,
                        data[i].name,
                        data[i].is_ready
                    );
                    this.addPlayer(player);
                }

                fireEvent(this.EVENT.PLAYER_CHANGE, this);
            }.bind(this));

            Client.on(Client.PACKET.TABLES_LIST, function (data) {
                for (var i in data) {
                    var table = new Table(
                        data[i].table_id,
                        data[i].name,
                        data[i].is_ready
                    );
                    for (var j in data[i].player_ids) {
                        table.addPlayer(this.getPlayerById(data[i].player_ids[j]));
                    }
                    this.initTable(table);
                }

                fireEvent(this.EVENT.TABLE_CHANGE, this);
                fireEvent(this.EVENT.LOAD, this);
            }.bind(this));

            Client.on(Client.PACKET.NEW_PLAYER, function (data) {
                var player = new Player(
                    data.player_id,
                    data.name,
                    data.is_ready
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
                this.initTable(table);

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

                    player.cardsHand.fromIds(data.cards[playerId].cards_hand);
                    player.cardsUp.fromIds(data.cards[playerId].cards_up);
                    player.cardsDown.fromIds(data.cards[playerId].cards_down);
                }

                this.isStarted = true;

                fireEvent(this.EVENT.GAME_START, this);
            }.bind(this));

            Client.on(Client.PACKET.SWAP, function (data) {
                this.getPlayerById(data.player_id).cardsUp.fromIds(data.cards_up);

                fireEvent(this.EVENT.TABLE_CHANGE, this);
            }.bind(this));

            Client.on(Client.PACKET.SWAP_DONE, function (data) {
                this.getPlayerById(data.player_id).isActive = true;

                fireEvent(this.EVENT.PLAYER_CHANGE, this);
                fireEvent(this.EVENT.SWAP_DONE, this);
            }.bind(this));

            Client.on(Client.PACKET.TURN, function (data) {

                // todo: refactor !

                var card, i;
                var player = this.getActivePlayer();
                player.isActive = false;

                for (i in data.cards_put) {
                    card = new Card();
                    card.fromId(data.cards_put[i]);
                    this.deckUp.add(card);
                    if (player.id == this.playerId) {
                        if (player.cardsHand.count()) {
                            player.cardsHand.removeById(card.getId());
                        } else if(player.cardsUp.count()) {
                            player.cardsUp.removeById(card.getId());
                        } else {
                            player.cardsDown.removeAt(0);
                        }
                    } else {
                        if (player.cardsHand.count()) {
                            player.cardsHand.removeAt(0);
                        } else if(player.cardsUp.count()) {
                            player.cardsUp.removeById(card.getId());
                        } else {
                            player.cardsDown.removeAt(0);
                        }
                    }
                }

                for (i in data.cards_pick) {
                    card = this.deckUp.getById(data.cards_pick[i]);

                    if (card != null) {
                        this.deckUp.remove(card);
                    } else {
                        if (this.deckDown.count()) {
                            this.deckDown.removeAt(0);
                        }
                        card = new Card();
                        card.fromId(data.cards_pick[i]);
                    }

                    player.cardsHand.add(player.id == this.playerId ? card : new Card());
                }

                this.getPlayerById(data.player_id).isActive = true;

                fireEvent(this.EVENT.TURN, this);
            }.bind(this));

            Client.on(Client.PACKET.PLAYER_LEFT_TABLE, function (data) {
                if (data.player_id == this.playerId) {
                    this.tableId = null;
                    this.isReady = false;
                    this.isStarted = false;
                    this.isSwapDone = false;
                    this.deckDown.removeAll();
                    this.deckUp.removeAll();
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

            Client.on(Client.PACKET.PLAYER_LEFT, function (data) {
                var table = this.getTableByPlayerId(data.player_id);
                if (table) {
                    if (table.isReady) {
                        // game already started, notice user left
                    } else {
                        // game hasn't started yet, simply remove the user
                        table.removePlayerById(data.player_id);
                    }
                    fireEvent(this.EVENT.TABLE_CHANGE, this);
                }

                this.removePlayerById(data.player_id);

                fireEvent(this.EVENT.PLAYER_CHANGE, this);
            }.bind(this));

            Client.on(Client.PACKET.TABLE_RESET, function (data) {
                this.getTableById(data.table_id).reset();

                fireEvent(this.EVENT.TABLE_CHANGE, this);
            }.bind(this));
        }

        return new Game();
    }]
);