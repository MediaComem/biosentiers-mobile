/**
 * Created by Mathias on 17.05.2016.
 */
(function () {
  'use strict';

  angular
    .module('app')
    .run(ionicitude);

  function ionicitude($cordovaDeviceOrientation, $ionicPlatform, Ionicitude, $cordovaToast, $log, PoiGeo, PoiContent, $q, Timers, WorldActions) {

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
      }

      function addIonicitudeAction(func) {
        if (!func.name) {
          throw new Error('Ionicitude action function must be named');
        }

        return Ionicitude.addAction(func.name, wrapIonicitudeAction(func));
      }

      function wrapIonicitudeAction(func) {
        return function(service, data) {

          var executionId = data._executionId;

          var resultOrPromise = func(service, _.omit(data, '_executionId'));

          if (executionId) {
            $q.resolve(resultOrPromise).then(function(result) {
              WorldActions.execute('returnResultFromApp', {
                id: executionId,
                result: result
              });
            })
          }

          return resultOrPromise;
        }
      }
    });
  }
})();
