(function() {
  'use strict';
  angular
    .module('activity-tracker-module')
    .factory('LogUploader', LogUploaderFn);

  function LogUploaderFn(API_URL, EVENTS_API, InstallationId, AuthToken, LogPaths, $http, jwtHelper, $q) {
    var service = {
      upload: upload
    };

    return service;

    ////////////////////

    function upload() {
      $q.all({
        token    : getValideToken(),
        iid      : InstallationId.getValue(),
        filePaths: getFileToUploadPaths()
      }).then(function(results) {
        console.log('LU requested data', results);
      })
    }

    /**
     * Returns a valid JWT token by calling the AuthToken.get function.
     * If the received token is no more valid, a new token will be fetched from the backend.
     * @param opt An option object with a 'regen' property to true, to get a fresh token. Is only passed recursively when a token is no more valid.
     */
    function getValideToken(opt) {
      opt = opt || {regen: false};
      return AuthToken.get(opt)
        .then(function(token) {
          var now = new Date();
          var expDate = jwtHelper.getTokenExpirationDate(token);
          if (now > expDate) {
            return getValideToken({regen: true});
          } else {
            return token;
          }
        })
    }

    function sendRequest() {

    }

    function getFileToUploadPaths() {
      return [];
    }
  }
})();
