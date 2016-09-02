/**
 * Created by Mathias on 17.05.2016.
 */
(function () {
  'use strict';

  angular
    .module('app')
    .run(ionicitude);

  function ionicitude($cordovaDeviceOrientation, $ionicPlatform, Ionicitude, $cordovaToast, $log, PoiGeo, PoiContent, Timers, WorldActions) {

    var deviceOrientationWatch,
        deviceOrientationUpdatesInterval = 250;

    $ionicPlatform.ready(function () {
      Ionicitude.init()
        .then(function (success) { console.log(success); })
        .catch(function (error) { console.log(error); });

      /**
       * Registering Ionicitude Actions
       */
      Ionicitude
        .addAction(open)
        .addAction(loadMarkerData)
        .addAction(toast)
        .addAction(setPosition)
        .addAction(close)
        .listLibActions();

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

      function loadMarkerData(service, param) {
        console.log('get marker data');
        WorldActions.execute('loadPoiData', PoiContent.getData(param.id), param.properties);
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
    });
  }
})();
