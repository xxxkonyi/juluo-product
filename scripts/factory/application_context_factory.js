'use strict';

/**
 * This service is responsible for keeping track of anything that is application oriented
 */
webapp.factory('ApplicationContext', function ($rootScope, $log, $localStorage) {
    // this is the backend api version we want to use
//  var initialHeaders = {'Accept': configuration.version, 'Content-Type': configuration.version};
    var initialHeaders = {};//{'Content-Type': 'application/json'};
    var httpFields = {withCredentials: true};
    var headers = angular.copy(initialHeaders);
    var xAuthToken = null;
    var preLoginState = null;
    var csrfToken;

    var self = {

        isLoggedIn: function () {
            $log.debug('Is user already logged in: ' + ($rootScope.user !== undefined));
            return $rootScope.user !== undefined;
        },

        clear: function () {
            $log.debug('Clearing out user session context');

            // Reset the values
            xAuthToken = null;
            self.resetHeaders();
            delete $rootScope.user;
            delete $localStorage.authToken;
            preLoginState = null;
            $rootScope.isLoggedIn = false;

            $log.debug('Headers have been reset');
            $log.debug(headers);
        },

        updateHeaders: function (newHeaders) {
            $log.debug('Old HTTP headers');
            $log.debug(headers);

            headers = angular.extend(headers, newHeaders);

            $log.debug('Updated headers');
            $log.debug(headers);
        },

        resetHeaders: function () {
            $log.debug('Reset to initial headers');
            $log.debug(initialHeaders);
            headers = angular.copy(initialHeaders);

            // re-add csrf header
            if (csrfToken !== undefined) {
                self.setCsrfToken(csrfToken);
            }
        },

        setAuthToken: function (authToken) {
            $log.info('Setting Auth Token for user: ' + authToken);

            // Update the Auth headers
            var xauthHeader = {
                'X-Auth-Token': authToken
            };

            // Save the token in local storage so we can try to re-authenticate at a later time
            $localStorage.authToken = authToken;

            // also set it on the service
            xAuthToken = authToken;

            // update headers with application context
            self.updateHeaders(xauthHeader);
        },

        getAuthToken: function () {
            var result;

            if (xAuthToken) {
                result = xAuthToken;
            }
            var localStorageAuthToken = $localStorage.authToken;
            if (localStorageAuthToken) {
                self.setAuthToken(localStorageAuthToken);
                result = localStorageAuthToken;
            }

            $log.debug('Auth token: ' + result);

            return result;
        },

        setUser: function (user) {
            $rootScope.user = user;
            $rootScope.isLoggedIn = true;
        },

        getUsername: function () {
            return $rootScope.user.username;
        },

        getHeaders: function () {
            return headers;
        },

        setPreLoginState: function (newState) {
            preLoginState = newState;
        },

        getPreLoginState: function () {
            return preLoginState;
        },

        getHttpFields: function () {
            return httpFields;
        },

        getCsrfToken: function () {
            return csrfToken;
        },

        setCsrfToken: function (newToken) {
            csrfToken = newToken;
            $log.info('Setting CSRF Token for user: ' + csrfToken.token);

            var csrfHeader = {
                'x-csrf-token': csrfToken.token
            };

            self.updateHeaders(csrfHeader);
        },

        hasRole: function (role) {

            if (!self.isLoggedIn()) {
                return false;
            }

            if ($rootScope.user.roles[role] === undefined) {
                return false;
            }

            return $rootScope.user.roles[role];
        }
    };

    return self;
});