/**
 * Created by Mathias Oberson on 10.02.2017.
 */
(function() {
  'use strict';
  angular
    .module('activity-tracker-module')
    .service('ActivityTracker', ActivityTrackerService);

  function ActivityTrackerService(FsUtils, LogUploader, LogPaths, $cordovaFile, $q) {
    var service                 = {
          moveToUpload: moveToUploadFn,
          addLog      : addLogFn,
          debug       : debugFn,
          reset       : resetFn
        },
        currentOperationPromise = null;

    return service;

    /* ----- Public functions ----- */

    function moveToUploadFn() {
      // Wait on the current operation to finish before executing this one.
      currentOperationPromise = $q.when(currentOperationPromise)
      // Wathever the outcome of the previous action is, intercept the catch and carry on.
        .catch(_.noop)
        .then(checkCurrentLogfile)
        .then(moveLogfile)
        .then(function() {
          LogUploader.upload();
        });

      return currentOperationPromise;
    }

    function addLogFn(logObject) {
      if (!logObject || typeof logObject !== 'object') throw new TypeError('ActivityTracker.addLog expects an object as its first argument. "' + typeof logObject + '" given.');
      currentOperationPromise = $q.when(currentOperationPromise)
      // Wathever the outcome of the previous action is, intercept the catch and carry on.
        .catch(_.noop)
        .then(checkCurrentLogfile)
        .then(function() {
          return appendToFile(logObject);
        })
        .catch(function(result) {
          if (result.code === 1) {
            return createLogfile(logObject);
          } else {
            throw result;
          }
        });

      return currentOperationPromise;
    }

    /**
     * DEBUG Removes the ActivityTracker directory recursively.
     */
    function resetFn() {
      $cordovaFile.removeRecursively(cordova.file.dataDirectory, LogPaths.baseDir)
        .then(function(success) {
          console.log('AT all logs deleted', success);
        })
        .catch(function(error) {
          console.log('AT reset error', error);
        })
    }

    function debugFn() {
      return $q.when()
        .then(getAllLogfileNames)
        .then(function(logfilesNames) {
          console.log('AT debugFn', logfilesNames);
          for (var logfileName of logfilesNames) {
            readFileContent(logfileName);
          }
        })
        .catch(function(error) {
          console.error('AT debugFn', error);
        })
    }

    /* ----- Private functions ----- */

    // function existingLogfile() {
    //   return $q.when()
    //     .then(activateQueuing)
    //     .then(moveLogfile)
    //     // .then(createLogfile)
    //     .then(resolveQueuing)
    //     .catch(function(error) {
    //       $log.error(error);
    //       throw error;
    //     })
    // }

    function moveLogfile() {
      return $q.when()
        .then(FsUtils.safeUploadDir)
        .then(function() {
          return $cordovaFile.moveFile(cordova.file.dataDirectory, LogPaths.logfile.path, cordova.file.dataDirectory, LogPaths.uploadDir + '/' + Date.now());
        });
    }

    function createLogfile(logObject) {
      return $cordovaFile.writeFile(cordova.file.dataDirectory, LogPaths.logfile.path, JSON.stringify(logObject), false);
    }

    /**
     *
     * @param logObject An object of class BaseLog
     * @return {*}
     */
    function appendToFile(logObject) {
      return $cordovaFile.writeExistingFile(cordova.file.dataDirectory, LogPaths.logfile.path, "," + JSON.stringify(logObject), false);
    }

    /**
     * Reads the content of the file located at the given filePath, and returns this content as a Javascript object
     * @param filePath
     * @return {Promise}
     */
    function readFileContent(filePath) {
      console.log('AT file path', cordova.file.dataDirectory + filePath);
      return $cordovaFile.readAsText(cordova.file.dataDirectory, filePath)
        .then(function(success) {
          console.log('AT log file raw content', angular.copy(success));
          success = JSON.parse("[" + success + "]");
          console.log('AT log file JSON content', success);
          return success;
        })
        .catch(function(error) {
          console.log('AT read error', error);
          throw error;
        })
    }

    function getAllLogfileNames() {
      return $q(function(resolve, reject) {
        console.log('AT getAllLogfileNames from', cordova.file.dataDirectory + LogPaths.baseDir);
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory + LogPaths.baseDir,
          function(dirEntry) {
            var dirReader = dirEntry.createReader();
            dirReader.readEntries(function(files) {
              var fileNames = [];
              console.log('AT files', files);
              for (var i = 0; i < files.length; i++) {
                console.log('AT', files[i], files[i].name);
                fileNames.push(LogPaths.baseDir + '/' + files[i].name);
              }
              resolve(fileNames);
            }, function(error) {
              console.error('AT readEntries', error);
              reject(error);
            })
          }, function(error) {
            console.error('AT getAllLogfileNames', error);
            reject(error);
          });
      })
    }

    /**
     * Checks wether the current log file exists or not.
     * @return {Promise}
     */
    function checkCurrentLogfile() {
      return $q.when()
        .then(FsUtils.safeBaseDir)
        .then(function() {
          return $cordovaFile.checkFile(cordova.file.dataDirectory, LogPaths.logfile.path);
        });
    }
    //
    // /**
    //  * Check that the base directory exists or creates it if not.
    //  * Should be called before accessing all files.
    //  * @return {Promise}
    //  */
    // function safeBaseDir() {
    //   return $q(function(resolve, reject) {
    //     $cordovaFile.checkDir(cordova.file.dataDirectory, LogPaths.baseDir)
    //       .then(resolve)
    //       .catch(function(error) {
    //         if (error.code === 1) {
    //           $cordovaFile.createDir(cordova.file.dataDirectory, LogPaths.baseDir)
    //             .then(resolve)
    //             .catch(reject);
    //         } else {
    //           reject(error);
    //         }
    //       })
    //   })
    // }
    //
    // /**
    //  * Checks that the upload dir exists or creates it if not.
    //  * Should be called before accessing files to upload.
    //  * @return {Promise}
    //  */
    // function safeUploadDir() {
    //   return $q(function(resolve, reject) {
    //     safeBaseDir()
    //       .then(function() {
    //         $cordovaFile.checkDir(cordova.file.dataDirectory, LogPaths.uploadDir)
    //           .then(resolve)
    //           .catch(function(error) {
    //             if (error.code === 1) {
    //               $cordovaFile.createDir(cordova.file.dataDirectory, LogPaths.uploadDir)
    //                 .then(resolve)
    //                 .catch(reject);
    //             } else {
    //               reject(error);
    //             }
    //           })
    //       })
    //   });
    // }
  }
})();
