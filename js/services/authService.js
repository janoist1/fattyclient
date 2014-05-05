'use strict';

damFattyServices.factory('Auth', function ($http, $cookieStore, Base64) {

    var defaultUser = {
        email: '',
        role: config.userRoles.visitor,
        title: 'anonymous'
    };
    var accessLevels = config.accessLevels;
    var userRoles = config.userRoles;
    var currentUser = $cookieStore.get('user') || {};

    if (Object.keys(currentUser).length === 0) {
        changeUser(defaultUser);
    } else {
        setHttpAuthorization(currentUser);
    }

    function changeUser(user) {
        _.extend(currentUser, user);
    };

    function setHttpAuthorization(data) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + data.hash;
        $http.defaults.useXDomain = true;
//        delete $http.defaults.headers.common['X-Requested-With'];
        $http.defaults.withCredentials = false;
//        $http.defaults.headers.common['X-Authorization'] = data.hash;
    };

    function generateHash(user) {
        return Base64.encode(user.email + ':' + user.password);
    }

    return {
        authorize: function (accessLevel, role) {
            if (role === undefined) {
                role = currentUser.role;
            }

            return accessLevel & role;
        },

        isLoggedIn: function (user) {
            if (user === undefined)
                user = currentUser;
            return user.role & userRoles.player;
        },

        login: function (data, success, error) {
            var rememberMe = data.rememberMe;

            data.hash = generateHash(data);
            setHttpAuthorization(data);

            $http.get(config.api.url + '/users/' + data.email)
                .success(function (user) {
                    user.role = userRoles.player;
                    user.title = 'player';
                    user.hash = data.hash;

                    if (rememberMe) {
                        $cookieStore.put('user', user);
                    }

                    changeUser(user);
                    success(user);
                })
                .error(error);
        },

        logout: function (success) {
            changeUser(defaultUser);
            $cookieStore.remove('user');
            success();
        },

        on: function (type, callback) {
            callbacks[type] = function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(null, args);
                });
            };
        },

        accessLevels: accessLevels,
        userRoles: userRoles,
        user: currentUser
    };
});
