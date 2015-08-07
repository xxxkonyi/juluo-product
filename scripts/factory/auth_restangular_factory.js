'use strict';

webapp.factory('AuthRestangular', function($state, $rootScope, Restangular, $localStorage, $log, ApplicationContext) {
  return Restangular.withConfig(function(RestangularConfigurer) {

    // use only if for some reason regular rest calls need to know the contents of headers
    // RestangularConfigurer.setFullResponse(true);

    // something like www.bearchoke.com:8080/api
    RestangularConfigurer.setBaseUrl('http://139.129.118.196/backend/api');

    // we want to tell restangular what version of the backend rest api we want to use plus include security tokens
    RestangularConfigurer.setDefaultHeaders(ApplicationContext.getHeaders());

    RestangularConfigurer.setDefaultHttpFields(ApplicationContext.getHttpFields());

    /*
     * This is where we capture the x-auth-token we receive when we successfully log in
     */
    RestangularConfigurer.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
      if (response.headers('X-Auth-Token')) {
        if (!data) {
          data = {};
        }

        // add token to result
        data.authToken = response.headers('X-Auth-Token');
        ApplicationContext.setAuthToken(data.authToken);

        // set updated headers on Restangular
        RestangularConfigurer.setDefaultHeaders(ApplicationContext.getHeaders());
      }
      if (data.headerName === 'X-CSRF-TOKEN' && data.parameterName === '_csrf') {
        $log.info('CSRF token intercepted');
        // add srf token to ApplicationContext
        ApplicationContext.setCsrfToken(data);

        // set updated headers on Restangular
        RestangularConfigurer.setDefaultHeaders(ApplicationContext.getHeaders());
      }
      return data;
    });

    /*
    This is the interceptor we go to when we try to call a secured url
     */
    RestangularConfigurer.setErrorInterceptor(function(response, deferred) {
      $log.error('Response URL: ' + response.config.url);

      if (response.status == 0) {
        console.log('服务器无响应', '操作提示');
        return false;
      }
      
      if (response.status === 401 && response.config.url.search(/\/authenticate/) === -1) {
        $log.error('API Request unauthorized from state: ' + $state.current.name);
        $rootScope.$emit('event.login.unauthorized');
        return false;
      }

      if (response.status === 403) {
        console.log('您没有权限访问该接口', '操作提示');
        return false;
      }

      return true;
    });
  });
});