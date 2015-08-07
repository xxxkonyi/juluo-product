/**
 * Code by baixiaosheng on 2015/7/16.
 */
'use strict';

webapp.factory('AuthenticationFactory', function ($rootScope, $state, $log, AuthRestangular, $localStorage, ApplicationContext, eventConstants) {

    var self = {

        login: function (username, password, success, error) {

            $log.debug('Attempting to authenticate...');

            // authenticate with the server
            AuthRestangular.one('authenticate').customPOST({}, '', {username: username, password: password}).then(function(data) {

                // fire off successful login event
                $log.debug('Firing off authentication success event');
                $rootScope.$emit(eventConstants.authentication, {username: username, loginType: 'Manual'});

                self.getUser(success, error);
            }, function(response) {
                $log.warn('Authentication failure: ' + response.statusText);
                self.clearAuth();

                if (error) {
                    error('Could not verify username and password.');
                }
            });

        },

        register: function (user, success, error) {
            $log.debug('Registering new user....');
            //$log.debug(user);

            // authenticate with the server
            AuthRestangular.one('user/register').customPOST(user).then(function(data) {

                // fire off successful login event
                $rootScope.$emit(eventConstants.registration, {username: user.username, registerType: 'Manual'});

                // fire off success event
                success();
            }, function(data) {
                $log.error('Registration failure: ' + data.statusText);

                if (error) {
                    error('There was a problem with your registration.');
                }
            });
        },

        logout: function (success) {
            $log.debug('Logging out user from session and server...');

            AuthRestangular.one('logout').get().then(function(data) {
                $log.debug('User logged out from server successfully');
            }, function() {
                $log.debug('Server logout failure');
            });

            // clear out everything on the front-end side related to the user session
            self.clearAuth();

            $rootScope.$emit(eventConstants.logout);

            if (success) {
                success();
            }
        },

        remember: function (success, error) {
            var authToken = ApplicationContext.getAuthToken();
            if (authToken) {
                $log.info('Checking for remember me user with token: ' + authToken);
                // Update the Auth headers
                AuthRestangular.setDefaultHeaders(ApplicationContext.getHeaders());

                self.getUser(success, error);
            }
        },

        resetPassword: function(email) {
            var promise = AuthRestangular.all('password/reset').post({ email: email });
            return promise;
        },

        getUser: function (success, error) {
            // Get the logged in user information
//      $log.debug(ApplicationContext.getHeaders());
            $log.debug('Attempting to retrieve user');

            AuthRestangular.one('secured/user').get().then(function (data) {
                $log.debug('Retrieved user successfully');
                //$log.debug(data);
                ApplicationContext.setUser(data);

                if (success) {
                    // dispatch login success event
                    success(data);
                }
            }, function (err) {
                $log.error('getUser() failure: ' + err.statusText);
                self.clearAuth();

                // DUBIOUS - probably want to move this into a controller
                $state.go('login');

                if (error) {
                    error('Could not verify username and password. Please try again', err);
                }
            });
        },

        clearAuth: function() {
            // Reset the values
            ApplicationContext.clear();

            // Reset the AuthRestangular headers
            AuthRestangular.setDefaultHeaders(ApplicationContext.getHeaders());
        }
    };

    //
    // EVENTS
    //
    $rootScope.$on('event.login.unauthorized', function() {
        $log.warn('Caught unauthorized event, redirect to login');
        self.clearAuth();
        $state.go('login');
    });

    return self;
});