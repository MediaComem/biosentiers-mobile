/*
  Service responsible for generating and reading the installation id of an app instance.
  This installation id will then be used when connecting to the backend for synchonization purposes.
  To get the value of this id, call the only service's method getValue ; the actual value is accesible through the id property of the result
 */
(function() {
  'use strict';
  angular.module('installation-id-module', []);

  angular.module('installation-id-module')
    .factory('InstallationId', InstallationIdFn);

  function InstallationIdFn($cordovaFile, $log, $q, uuid) {
    var deferred,
        fileName = 'installation-id.txt',
        service  = {
          getValue: fetchOrCreate
        };

    return service;

    ////////////////////

    /**
     * Returns a Promise that resolves if the installation-id.txt file exists.
     * If the promise is rejected, you can check if the result's 'code' property equals 1. That would mean that the file does not exist.
     * Any other code could mean other errors. See here for a list of probable errore codes: http://ngcordova.com/docs/plugins/file/
     * @return {Promise}
     */
    function exists() {
      return $cordovaFile.checkFile(cordova.file.dataDirectory, fileName);
    }

    /**
     * Fetches or Creates the installation id for this application instance.
     * The installation id can be force regenerated if an opt object is passed with the property regen set to true
     * @param {{regen:Boolean}} opt An object of options
     * @return {Promise} If resolved, the value will be that of the iid. If rejected, it will contains some error object or message.
     */
    function fetchOrCreate(opt) {
      opt = opt || {regen: false};
      if (!deferred || opt.regen === true) {
        deferred = $q.defer();
        exists()
          .then(readFile)
          .catch(failedChedk)
      }
      return deferred.promise;
    }

    /**
     * Reads the iid from the installation-id.txt file.
     * Will resolve the getValue promise if successful and reject it if not
     */
    function readFile() {
      $cordovaFile.readAsText(cordova.file.dataDirectory, fileName)
        .then(function(content) {
          deferred.resolve(JSON.parse(content));
        })
        .catch(deferred.reject)
    }

    /**
     * Triggered when checking for the file existince failed.
     * This failure can be what is expected if the result.code is 1, which means that the file doesn't exist (and thus, it's the first time the app is launched)
     * If it's the case, then a call to createIidFile is made.
     * Oterhwise, the getValue promise is rejected.
     * @param result
     */
    function failedChedk(result) {
      $log.debug('InstallationId checkFile exisence error', result);
      result.code === 1 ? createIidFile() : deferred.reject(result);
    }

    /**
     * Creates the installation-id.txt file and generates the uuid that it will contains.
     * When the creation is successful, the getValue promise is resolved with the iid value.
     * If it fails, then the promise is rejected instead.
     */
    function createIidFile() {
      var content = {
        id            : uuid.gen(),
        firstStartedAt: (new Date()).toISOString(),
        properties    : {
          device: device
        }
      };
      $log.debug('InstallationId generated iid', content);
      $cordovaFile.writeFile(cordova.file.dataDirectory, fileName, JSON.stringify(content), true)
        .then(function(result) {
          $log.debug('InstallationId create file success', result);
          deferred.resolve(content);
        })
        .catch(function(error) {
          $log.debug('InstallationId create file error', error);
          deferred.reject(error);
        })
    }
  }
})();
