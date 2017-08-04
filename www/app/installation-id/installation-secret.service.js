(function() {
  'use strict';
  angular
    .module('installation-id-module')
    .factory('InstallationSecret', InstallationSecretFn);

  function InstallationSecretFn($cordovaFile, API_URL, REGISTER_API, InstallationId, $http, $q) {
    var registerDefer,
        valueDefer,
        fileName = 'installation-secret.txt',
        service  = {
          registerApp: registerAppFn,
          exists     : existsFn,
          getValue   : getValueFn
        };

    var checkIdAlreadyUsedError = {
      location : "/id",
      validator: "installation.idAvailable"
    };

    return service;

    ////////////////////

    function existsFn() {
      return $cordovaFile.checkFile(cordova.file.dataDirectory, fileName)
    }

    function registerAppFn() {
      if (!registerDefer) {
        registerDefer = $q.defer();
        InstallationId.getValue()
          .then(callApi)
          .then(saveSecret)
          .catch(handleError)
      }
      return registerDefer.promise;
    }

    function callApi(iid) {
      return $http.post(API_URL + REGISTER_API, iid)
    }

    function saveSecret(response) {
      console.log('Response OK', response.data.sharedSecret);
      $cordovaFile.writeFile(cordova.file.dataDirectory, fileName, response.data.sharedSecret, true)
        .then(function(success) {
          console.log('Secret saved', success);
          registerDefer.resolve(response.data.sharedSecret);
        })
        .catch(function(error) {
          registerDefer.reject({
            location: {
              file: 'installation-secret-service.js',
              line: 52,
              func: 'saveSecret'
            },
            error   : error
          });
        })
    }

    function handleError(error) {
      if (_.find(error.data.errors, checkIdAlreadyUsedError) !== undefined) {
        InstallationId.getValue({regen: true})
          .then(callApi)
          .then(saveSecret)
          .catch(handleError)
      } else {
        registerDefer.reject({
          location: {
            file: 'installation-secret-service.js',
            line: 70,
            func: 'handlError'
          },
          error   : error
        });
      }
    }

    function getValueFn() {
      if (!valueDefer) {
        valueDefer = $q.defer();
        $cordovaFile.readAsText(cordova.file.dataDirectory, fileName)
          .then(valueDefer.resolve)
          .catch(valueDefer.reject);
      }
      return valueDefer.promise;
    }
  }
})();
