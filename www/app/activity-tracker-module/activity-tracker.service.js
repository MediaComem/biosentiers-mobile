/**
 * Created by Mathias Oberson on 10.02.2017.
 */
(function() {
  'use strict';
  angular
    .module('activity-tracker-module')
    .service('ActivityTracker', ActivityTrackerService);

  function ActivityTrackerService(FsUtils, $ionicPlatform, LogUploader, $q, TimerUploadObs, $log) {
    var TAG                     = '[ActivityTracker] ',
        currentOperationPromise = null, // Will store the promise of the current operation
        logCount                = 0,
        logLimit                = 100,
        running                 = true;

    $ionicPlatform.ready(function() {
      // When the app is ready, it means that it had just been started.
      // Thus, move the 'currentLog' file to the upload folder, in order to start a new one.
      moveLog();
      TimerUploadObs.subscribe(moveLog);
    });

    addLog.start = startService;
    addLog.stop = stopService;

    return addLog;

    /* ----- Public functions ----- */

    /**
     * Moves the 'currentLog' file from the folder 'ActivityTracker' to the subfolder 'toUpload'.
     * The file will be renamed with the current timestamp.
     * IMPORTANT: This function needs to stay in this service, to ensure that adding a log and moving the logfile are never executed at the same time.
     * @return {Promise}
     */
    function moveLog() {
      if (running) {
        // Wait on the current operation to finish before executing this one.
        currentOperationPromise = $q.when(currentOperationPromise)
        // Wathever the outcome of the previous action is, intercept the catch and carry on.
          .catch(_.noop)
          .then(FsUtils.checkCurrentLogfile)
          .then(FsUtils.moveLogfile)
          .then(function() {
            // Reinitialize the counter since the file has been moved.
            logCount = 0;
            // Notify the uploader that it should try to upload the files.
            LogUploader();
          });
      } else {
        var reason = 'The ActivityTracker service is not running. Try calling ActivityTracker.start() and retry.';
        currentOperationPromise = $q.reject(reason);
        $log.warn(TAG + reason);
      }
      return currentOperationPromise;
    }

    /**
     * Adds a new log to the currentLog file.
     * It is not needed to create the file before colling addLog(), as it will be created by this function if it does not exists yet.
     * @param logObject An object of class Event representing the log to add to the file.
     * @return {Promise}
     */
    function addLog(logObject) {
      return $ionicPlatform.ready(function() {
        if (!logObject || typeof logObject !== 'object') throw new TypeError('ActivityTracker.addLog expects an object as its first argument. "' + typeof logObject + '" given.');
        if (running) {
          currentOperationPromise = $q.when(currentOperationPromise)
          // Wathever the outcome of the previous action is, intercept the catch and carry on.
            .catch(_.noop)
            .then(function() {$log.log(TAG + 'new line starting', logObject);})
            .then(FsUtils.checkCurrentLogfile)
            .then(_.wrap(logObject, FsUtils.appendToFile))
            .catch(function(result) {
              if (result.code === 1) {
                return FsUtils.createLogfile(logObject);
              } else {
                throw result;
              }
            })
            .then(incrementCounter);
        } else {
          var reason = 'The ActivityTracker service is not running. Try calling ActivityTracker.start() and retry.';
          currentOperationPromise = $q.reject(reason);
          $log.warn(TAG + reason);
        }
        return currentOperationPromise;
      });
    }

    /* ----- Private Functions ----- */

    /**
     * Increment the log counter.
     * If the log limit has been reached, the current log is moved in the upload folder.
     */
    function incrementCounter() {
      logCount += 1;
      $log.log(TAG + 'Iterating log counter', logCount);
      logCount >= logLimit && moveLog();
    }

    /**
     * Set the 'running' private variable to 'true', so that the service will continue adding logs and moving files.
     */
    function startService() {
      $log.log(TAG + 'starting');
      running = true;
    }

    /**
     * Sets the 'running' private variable to false, so that the service will stop adding logs and moving files.
     */
    function stopService() {
      $log.log(TAG + 'stopping');
      running = false;
    }
  }
})();
