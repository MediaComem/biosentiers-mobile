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
          getValue: fetchOrCreateFn
        };

    var checkIdAlreadyUsedError = {
      location : "/id",
      validator: "installation.idAvailable"
    };

    return service;

    ////////////////////

    /**
     * Returns a Promise that resolves if the installation-secret.txt file exists.
     * If the promise is rejected, you can check if the result's 'code' property equals 1. That would mean that the file does not exist.
     * Any other code could mean other errors. See here for a list of probable errore codes: http://ngcordova.com/docs/plugins/file/
     * @return {Promise}
     */
    function exists() {
      return $cordovaFile.checkFile(cordova.file.dataDirectory, fileName)
    }

    /**
     * Starts the application registration process to get a secret that will be needed for subsequents API calls.
     * Using the installation id value, the API will be called and the returned secret will be saved in a permanent file.
     * If the installation id has already been use, a new id will ne regenerated and the process will be started again.
     * @return {Promise} A promise that will resolve with the value of the secret.
     */
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

    /**
     * Exacutes the call to the API in order to register the installation and get a secret.
     * @param iid The complete iid object, that can be retrieved with a call to InstallationId.getValue().
     */
    function callApi(iid) {
      return $http.post(API_URL + REGISTER_API, iid)
    }

    /**
     * Saves the received secret into its own file on the device's filesystem.
     * @param response The HTTP response object from the API call. The secret is located in the data.sharedSecret property.
     */
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

    /**
     * Handles error related to the API call.
     * If the response contains some value that indicates that the given installation id has already been used,
     * a new id is regenerated and the complete process is started again.
     * @param error
     */
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

    /**
     * Returns the secret value, wether from a previously saved file or from the backend.
     * @return {Promise} A Promise that will resolve with the secret value.
     */
    function fetchOrCreateFn() {
      if (!valueDefer) {
        valueDefer = $q.defer();
        exists()
          .then(readFile)
          .catch(failedCheck);
      }
      return valueDefer.promise;
    }

    /**
     * Get the content of the installation-secret.txt file
     */
    function readFile() {
      $cordovaFile.readAsText(cordova.file.dataDirectory, fileName)
        .then(valueDefer.resolve)
        .catch(valueDefer.reject);
    }

    /**
     * If the checkFile has been rejected, check if it's because the file does not exists.
     * If that's the case, then a call to the API is made in order to create said file.
     * @param error
     */
    function failedCheck(error) {
      if (error.code === 1) {
        registerAppFn()
          .then(valueDefer.resolve)
          .catch(valueDefer.reject)
      } else {
        valueDefer.reject(error);
      }
    }
  }
})();
