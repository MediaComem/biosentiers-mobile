/**
 * Created by Mathias on 17.05.2016.
 */
(function () {
  'use strict';

  angular
    .module('app')
    .run(ionicitude);

  function ionicitude($cordovaDeviceOrientation, $ionicPlatform, Ionicitude, $cordovaToast, $log, PoiGeo, PoiContent, $q, SeenPoisData, Timers, WorldActions) {

    var deviceOrientationWatch,
        deviceOrientationUpdatesInterval = 250;

    $ionicPlatform.ready(function () {
      Ionicitude.init()
        .then(function (success) { console.log(success); })
        .catch(function (error) { console.log(error); });

      /**
       * Register Ionicitude Actions
       */
      addIonicitudeAction(open);
      addIonicitudeAction(loadPoiDetails);
      addIonicitudeAction(toast);
      addIonicitudeAction(setPosition);
      addIonicitudeAction(close);
      addIonicitudeAction(addSeenPoi);

      Ionicitude.listLibActions();

      ////////////////////

      /**
       * Starts to watch the device's orientation and send the data to the AR View.
       * @param service The Ionicitude service
       */
      function open(service) {
        $log.debug('World opened');

        $log.debug('Starting device orientation updates every ' + deviceOrientationUpdatesInterval + 'ms');
        deviceOrientationWatch = $cordovaDeviceOrientation.watchHeading({
          frequency: deviceOrientationUpdatesInterval
        });

        deviceOrientationWatch.then(null, function(err) {
          $log.error(err);
        }, function(update) {
          WorldActions.execute('updateDeviceOrientation', update);
        });
      }

      function loadPoiDetails(service, param) {
        return PoiContent.getData(param.id);
      }

      function toast(service, param) {
        $cordovaToast.showLongCenter(param.message);
      }

      function setPosition(service, param) {
        console.log('setting position :', param);
        service.setLocation(param.lat, param.lon, param.alt, 1);
      }

      function close(service) {
        $log.debug('World closing');

        if (deviceOrientationWatch) {
          $log.debug('Stopping device orientation updates');
          deviceOrientationWatch.clearWatch();
        } else {
          $log.warn('No devices orientation updates to stop');
        }
        service.close();
        SeenPoisData.save();
      }

      function addSeenPoi(service, param) {
        $log.log('adding seen poi');
        SeenPoisData.addOne(param.outingId, param.poiId);
      }

      ////////////////////

      /**
       * Adds an Ionicitude action.
       *
       * The action is added in a wrapper that can automatically return the result
       * of the action to the wikitude world.
       *
       * Use the `AppActions` service in the wikitude world to execute these actions.
       *
       * @param {Function} func - The function to wrap.
       * @see {@link #wrapIonicitudeAction}
       */
      function addIonicitudeAction(func) {
        if (!func.name) {
          throw new Error('Ionicitude action function must be named');
        }

        return Ionicitude.addAction(func.name, wrapIonicitudeAction(func));
      }

      /**
       * Creates a wrapper around an Ionicitude action function that can automatically
       * return the result of the action to the wikitude world.
       *
       * A result will be returned only if the `_executionId` parameter is provided to
       * the generated function. The `AppActions` service in the wikitude world will
       * automatically generate and provide this execution ID if given the `return` option.
       *
       * @param {Function} func - The Ionicitude action function (it must be a named function).
       * @returns {Function} A wrapper function that can be added to Ionicitude.
       * @see AppActions
       */
      function wrapIonicitudeAction(func) {

        // Return the function that will actually be added to Ionicitude, and which will call `func`.
        return function(service, params) {

          // Retrieve the action execution ID provided by the wikitude world (if any).
          var executionId = params._executionId;

          // Execute the passed function (without the execution ID).
          var resultOrPromise = func(service, _.omit(params, '_executionId'));

          // If an execution ID was provided, resolve the result (it might be a value or a promise),
          // then return the result (or error) to the wikitude world.
          if (executionId) {
            $q.resolve(resultOrPromise).then(function(result) {
              returnResultToWorld(executionId, result);
            }, function(err) {
              returnErrorToWorld(executionId, err);
            });
          }

          return resultOrPromise;
        }
      }

      function returnResultToWorld(executionId, result) {
        WorldActions.execute('returnResultFromApp', {
          id: executionId,
          result: result
        });
      }

      function returnErrorToWorld(executionId, err) {
        WorldActions.execute('returnResultFromApp', {
          id: executionId,
          error: err.message
        });
      }
    });
  }
})();
