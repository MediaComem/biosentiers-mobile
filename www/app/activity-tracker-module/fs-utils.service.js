(function() {
  'use strict';
  angular
    .module('activity-tracker-module')
    .service('FsUtils', FsUtilsFn);

  function FsUtilsFn($cordovaFile, $cordovaToast, $log, LogPaths, $q) {
    var TAG = "[FsUtils] ";

    this.readFile = readFileContent;
    this.deleteFile = deleteFile;
    this.checkCurrentLogfile = checkCurrentLogfile;
    this.moveLogfile = moveLogfile;
    this.appendToFile = appendToFile;
    this.createLogfile = createLogfile;
    this.getFileToUploadPaths = getFileToUploadPaths;
    this.deleteBaseDir = deleteBaseDir;

    ////////////////////

    /* ----- Public Functions ----- */

    /**
     * Reads the content of the file located at the given filePath, and returns this content as a Javascript object
     * The file must contains JSON object, separated by a comma. The function will wrap the complete string around [] and parse the resulting JSON.
     * @param filePath The path of the file to read, relative to the dataDirectory folder.
     * @return {Promise} A promise that will resolve with the content of the file as an array of objects.
     */
    function readFileContent(filePath) {
      return $cordovaFile.readAsText(cordova.file.dataDirectory, filePath)
        .then(function(success) {
          return JSON.parse("[" + success + "]");
        });
    }

    /**
     * Deletes the file at the filePath location, using the dataDirectory of cordova.
     * @param filePath The path of the file to delete, relative to the dataDirectory folder.
     * @return {Promise} A promise that will resolve if the file has been removed and reject if it has not.
     */
    function deleteFile(filePath) {
      $log.log(TAG + 'Deleting file', filePath);
      return $cordovaFile.removeFile(cordova.file.dataDirectory, filePath);
    }

    /**
     * Checks wether the current log file exists or not.
     * @return {Promise} A promise that will resolve if the current log file exists, and reject otherwise.
     */
    function checkCurrentLogfile() {
      return $q.when()
        .then(safeBaseDir)
        .then(function() {
          return $cordovaFile.checkFile(cordova.file.dataDirectory, LogPaths.logfile.path);
        });
    }

    /**
     * Move the 'currentLog' file from the '/ActivityTracker' folder in the dataDirectory to the '/ActivityTracker/toUpload' folder in the dataDirectory.
     * @return {Promise} A promise that will be resolved if the file has been correctly moved, and rejected otherwise.
     */
    function moveLogfile() {
      return $q.when()
        .then(safeUploadDir)
        .then(function() {
          $log.log(TAG + 'Moving file to upload...');
          return $cordovaFile.moveFile(cordova.file.dataDirectory, LogPaths.logfile.path, cordova.file.dataDirectory, LogPaths.uploadDir + '/' + Date.now());
        });
    }

    /**
     * Transforms the given logObject to a JSON string, prefixed by a comma, and append that string to the 'currentLog' file content.
     * @param logObject An object of class Event representing the log to be append to the file.
     * @return {Promise} A Promise that will be resolved when the append correctly finished.
     */
    function appendToFile(logObject) {
      return $cordovaFile.writeExistingFile(cordova.file.dataDirectory, LogPaths.logfile.path, "," + JSON.stringify(logObject), false);
    }

    /**
     * Creates the 'currentLog' file, and write the given logObject (in a JSON string).
     * @param logObject An object of class Event representing the log to be written in the file.
     * @return {Promise} A Promise that will be resolved when the file is correctly created.
     */
    function createLogfile(logObject) {
      return $cordovaFile.writeFile(cordova.file.dataDirectory, LogPaths.logfile.path, JSON.stringify(logObject), false);
    }

    /**
     * Gets all file paths of the file present in the /ActivityTracker/toUpload directory, and returns them as an array of paths.
     * @return {Promise} A promise that will be resolved with an array of strings
     */
    function getFileToUploadPaths() {
      return $q(function(resolve, reject) {
        safeUploadDir()
          .then(function() {
            window.resolveLocalFileSystemURL(cordova.file.dataDirectory + LogPaths.uploadDir,
              function(dirEntry) {
                var dirReader = dirEntry.createReader();
                dirReader.readEntries(function(files) {
                  var fileNames = [];
                  for (var i = 0; i < files.length; i++) {
                    fileNames.push(LogPaths.uploadDir + '/' + files[i].name);
                  }
                  resolve(fileNames);
                }, reject)
              }, reject);
          })
      })
    }

    /**
     * DEBUG Removes the ActivityTracker directory recursively.
     */
    function deleteBaseDir() {
      $cordovaFile.removeRecursively(cordova.file.dataDirectory, LogPaths.baseDir)
        .then(function() {
          $cordovaToast.showShortBottom('Dossier "ActivityTracker" supprimé.');
        });
    }

    /* ----- Private Functions ----- */

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
              $log.log(TAG + 'Base dir needs to be created');
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
