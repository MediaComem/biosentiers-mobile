(function() {
  'use strict';
  angular
    .module('activity-tracker-module')
    .service('FsUtils', FsUtilsFn);

  function FsUtilsFn(LogPaths, $cordovaFile, $q) {

    this.safeBaseDir = safeBaseDir;
    this.safeUploadDir = safeUploadDir;

    ////////////////////

    /**
     * Check that the base directory exists or creates it if not.
     * Should be called before accessing all files.
     * @return {Promise}
     */
    function safeBaseDir() {
      return $q(function(resolve, reject) {
        $cordovaFile.checkDir(cordova.file.dataDirectory, LogPaths.baseDir)
          .then(resolve)
          .catch(function(error) {
            if (error.code === 1) {
              $cordovaFile.createDir(cordova.file.dataDirectory, LogPaths.baseDir)
                .then(resolve)
                .catch(reject);
            } else {
              reject(error);
            }
          })
      })
    }

    /**
     * Checks that the upload dir exists or creates it if not.
     * Should be called before accessing files to upload.
     * @return {Promise}
     */
    function safeUploadDir() {
      return $q(function(resolve, reject) {
        safeBaseDir()
          .then(function() {
            $cordovaFile.checkDir(cordova.file.dataDirectory, LogPaths.uploadDir)
              .then(resolve)
              .catch(function(error) {
                if (error.code === 1) {
                  $cordovaFile.createDir(cordova.file.dataDirectory, LogPaths.uploadDir)
                    .then(resolve)
                    .catch(reject);
                } else {
                  reject(error);
                }
              })
          })
      });
    }
  }
})();
