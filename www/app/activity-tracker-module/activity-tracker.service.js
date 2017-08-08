/**
 * Created by Mathias Oberson on 10.02.2017.
 */
(function() {
  'use strict';
  angular
    .module('activity-tracker-module')
    .service('ActivityTracker', ActivityTrackerService);

  function ActivityTrackerService(FsUtils, LogUploader, LogPaths, $cordovaFile, $q, rx) {
    var currentOperationPromise   = null, // Will store the promise of the current operation
        logCount                  = 0,
        logLimit                  = 100,
        logLimitReachedSubject = new rx.Subject(),
        service                   = {
          moveLog                  : moveLogFn,
          addLog                   : addLogFn,
          reset                    : resetFn,
          logLimitReachedObs: logLimitReachedSubject.asObservable()
        };

    return service;

    /* ----- Public functions ----- */

    /**
     * Moves the 'currentLog' file from the folder 'ActivityTracker' to the subfolder 'toUpload'.
     * The file will be renamed with the current timestamp.
     * @return {Promise}
     */
    function moveLogFn() {
      // Wait on the current operation to finish before executing this one.
      currentOperationPromise = $q.when(currentOperationPromise)
      // Wathever the outcome of the previous action is, intercept the catch and carry on.
        .catch(_.noop)
        .then(FsUtils.checkCurrentLogfile)
        .then(FsUtils.moveLogfile)
        .then(LogUploader);

      return currentOperationPromise;
    }

    /**
     * Adds a new log to the currentLog file.
     * It is not needed to create the file before colling addLog(), as it will be created by this function if it does not exists yet.
     * @param logObject An object of class BaseLog representing the log to add to the file.
     * @return {Promise}
     */
    function addLogFn(logObject) {
      if (!logObject || typeof logObject !== 'object') throw new TypeError('ActivityTracker.addLog expects an object as its first argument. "' + typeof logObject + '" given.');
      currentOperationPromise = $q.when(currentOperationPromise)
      // Wathever the outcome of the previous action is, intercept the catch and carry on.
        .catch(_.noop)
        .then(function() {console.log('AT new line starting');})
        .then(FsUtils.checkCurrentLogfile)
        .then(_.wrap(logObject, FsUtils.appendToFile))
        .catch(function(result) {
          if (result.code === 1) {
            return FsUtils.createLogfile(logObject);
          } else {
            throw result;
          }
        })
        .then(iterateCounter);

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

    /* ----- Private Functions ----- */

    function iterateCounter() {
      logCount += 1;
      console.log('Iterating log counter', logCount);
      logCount >= logLimit && logLimitReachedSubject.onNext();
    }
  }
})();
