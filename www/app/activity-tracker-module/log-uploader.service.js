(function() {
  'use strict';
  angular
    .module('activity-tracker-module')
    .factory('LogUploader', LogUploaderFn);

  function LogUploaderFn(API_URL, EVENTS_API, FsUtils, InstallationId, AuthToken, LogPaths, $http, jwtHelper, $q, $cordovaFile) {
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

    /**
     * Gets all file paths of the file present in the /ActivityTracker/toUpload directory, and returns them as an array of paths.
     * @return {Promise}
     */
    function getFileToUploadPaths() {
      return $q(function(resolve, reject) {
        FsUtils.safeUploadDir()
          .then(function() {
            console.log('LU getFileToUploadPaths from', cordova.file.dataDirectory + LogPaths.uploadDir);
            window.resolveLocalFileSystemURL(cordova.file.dataDirectory + LogPaths.uploadDir,
              function(dirEntry) {
                var dirReader = dirEntry.createReader();
                dirReader.readEntries(function(files) {
                  var fileNames = [];
                  console.log('LU files', files);
                  for (var i = 0; i < files.length; i++) {
                    console.log('LU', files[i], files[i].name);
                    fileNames.push(LogPaths.uploadDir + '/' + files[i].name);
                  }
                  resolve(fileNames);
                }, function(error) {
                  console.error('LU readEntries', error);
                  reject(error);
                })
              }, function(error) {
                console.error('LU getAllLogfileNames', error);
                reject(error);
              });
          })
      })
    }
  }
})();
