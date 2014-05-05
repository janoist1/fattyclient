(function (exports) {

    exports.userRoles = {
        visitor: 1,
        player: 2,
        admin: 4
    };

    exports.accessLevels = {
        public: Math.pow(2, Object.keys(exports.userRoles).length) - 1,
        anon: exports.userRoles.public,
        player: exports.userRoles.player + exports.userRoles.admin,
        admin: exports.userRoles.admin
    };

    exports.routing = {
        index: {
            controller: 'IndexController',
            url: '/',
            templateUrl: '/partials/index.html',
            access: exports.accessLevels.public
        },
        login: {
            controller: 'LoginController',
            url: '/login',
            templateUrl: '/partials/login.html',
            access: exports.accessLevels.public
        },
        lobby: {
            controller: 'LobbyController',
            url: '/lobby',
            templateUrl: '/partials/lobby.html',
            access: exports.accessLevels.player
        },
        gathering: {
            controller: 'GatheringController',
            url: '/gathering/:tableId',
            templateUrl: '/partials/gathering.html',
            access: exports.accessLevels.player
        },
        table: {
            controller: 'TableController',
            url: '/table/:tableId',
            templateUrl: '/partials/table.html',
            access: exports.accessLevels.player
        },
        e404: {
            url: '/404',
            templateUrl: '/partials/e404.html',
            access: exports.accessLevels.public
        }
    };

    exports.api = {
        url: 'http://api.damfatty.dev/app_dev.php'
    };

    exports.fattyServer = {
        url: 'ws://damfatty.dev:9991'
    };

})(typeof exports === 'undefined' ? this['config'] = {} : exports);