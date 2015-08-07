/**
 * Code by baixiaosheng on 2015/7/13.
 */
var webapp = angular.module('webapp', [
    'ui.router',
    'ngAnimate',
    'restangular',
    'ngStorage',
    'oc.lazyLoad',
    'naif.base64'
]).constant('eventConstants', {
    authentication: 'authentication',
    registration: 'registration',
    identify: 'identify',
    logout: 'logout'
})/*.run(function ($rootScope, $state, $stateParams, ApplicationContext) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$stateParams = $stateParams;
    $rootScope.isLoggedIn = ApplicationContext.isLoggedIn();
    $rootScope.hasRole = function (role) {
        var result = ApplicationContext.hasRole(role);
        return result;
    };
})*/;
