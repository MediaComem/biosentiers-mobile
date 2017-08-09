(function() {
  'use strict';
  angular
    .module('bio-api-module')
    .factory('BioApi', BioApiServiceFn);

  function BioApiServiceFn(InstallationId, $http, AuthToken, API_URL, jwtHelper, $q) {
    return completeConfig;

    ////////////////////

    /**
     * Completes the given config object to match the API requirements.
     * More specifically, it adds the 'Authorization' header with a valid JWT token,
     * concatenate the config.url with the full URL to the API,
     * replace the ':id' placeholder in the URL, if present, with the installation id of this instance of the application.
     * @param config The config object for the http service.
     */
    function completeConfig(config) {
      return $q.all({
        token: getValidToken(),
        iid  : InstallationId.getValue()
      }).then(function(results) {
        config.headers = {
          'Authorization': 'Bearer ' + results.token
        };
        config.url = API_URL + config.url;
        config.url = config.url.replace(":iid", results.iid.id);
        return $http(config)
          .catch(function(error) {
            console.error('BioApi http error', error);
          });
      })
    };

    /**
     * Returns a valid JWT token by calling the AuthToken.get function.
     * If the received token is no more valid, a new token will be fetched from the backend.
     * @param opt An option object with a 'regen' property to true, to get a fresh token. Is only passed recursively when a token is no more valid.
     */
    function getValidToken(opt) {
      opt = opt || {regen: false};
      return AuthToken.get(opt)
        .then(function(token) {
          if (jwtHelper.isTokenExpired(token)) {
            return getValidToken({regen: true});
          } else {
            return token;
          }
        })
    }

  }
})();
