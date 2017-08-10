(function() {
  'use strict';
  angular
    .module('activity-tracker-module')
    .factory('LogUploader', LogUploaderFn);

  function LogUploaderFn(EVENTS_API, FsUtils, BioApi, $q, $cordovaNetwork, $log) {
    var TAG = '[LogUploader] ',
        prevUploadActionPromise = null, // Will store the promise of the current upload
        running                 = true;

    upload.start = startService;
    upload.stop = stopService;

    return upload;

    ////////////////////

    /* ----- Public Functions ----- */

    /**
     * Uploads all the files in the '/ActivityTracker/toUpload' folder, one after the other.
     * @return {Promise} A promise that will be resolved when all the file have been processed (wether the upload succeeded or not).
     */
    function upload() {
      // Wait on the previous upload to finish, whatever it's outcome, then start a new one
      if (running && $cordovaNetwork.isOnline()) {
        prevUploadActionPromise = $q.when(prevUploadActionPromise).catch(_.noop)
          .then(FsUtils.getFileToUploadPaths)
          .then(function(filePaths) {
            // Using the reduce() function to ensure that all upload promises are sequentially executed
            return filePaths.reduce(function(prevAction, filePath) {
              // Using the finally() method so that the next upload is trigger whatever the outcome of the previous turns out to be.
              return prevAction.catch(_.noop)
                .then(_.wrap(filePath, uploadOneFile))
                .then(_.wrap(filePath, FsUtils.deleteFile));
            }, $q.when());
          });
      } else {
        var reason = 'The LogUploader is not running. Try calling LogUploader.start() and then retry.';
        prevUploadActionPromise = $q.reject(reason);
        $log.warn(TAG + reason);
      }
      return prevUploadActionPromise;
    }

    /* ----- Private Functions ----- */

    /**
     * Upload the content of the file accesible at the given filePath to the backend.
     * If the file contains more than a hundred log, it will be split in chunks of hundred logs, and send separatly.
     * @param filePath The path of the file whose content will be uploaded, relative to the dataDirectory folder.
     * @return {Promise} A promise that will be resolved when all the chunk of the file content have been uploaded
     */
    function uploadOneFile(filePath) {
      return $q.when(filePath)
        .then(FsUtils.readFile)
        .then(function(content) {
          return _.chunk(content, 100).reduce(function(prevAction, batch) {
            return prevAction.catch(_.noop)
              .then(_.wrap(batch, sendRequest))
          }, $q.when());
        })
    }

    /**
     * Uploads the given content to the backend.
     * @param logs An array of Event
     * @return {Promise} A promise that will be resolved when the upload is successful.
     */
    function sendRequest(logs) {
      return BioApi({
        url   : EVENTS_API,
        method: 'POST',
        data  : logs
      })
    }

    /**
     * Sets the 'running' private variable to 'true', so that the service continues to try and upload files.
     */
    function startService() {
      $log.log(TAG + 'starting.');
      running = true;
    }

    /**
     * Sets the 'running' private variable to 'false', so that the service stops to try and upload files.
     */
    function stopService() {
      $log.log(TAG + 'stopping.');
      running = false;
    }
  }
})
();
