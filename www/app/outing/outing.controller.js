/**
 * Created by Mathias on 29.03.2016.
 */
(function () {
  'use strict';

  angular
    .module('app')
    .controller('OutingCtrl', OutingCtrl);

  function OutingCtrl($cordovaToast, Icons, Ionicitude, $ionicPlatform, leafletData, $log, outingData, PoiGeo, $q, $scope, WorldActions) {
    var ctrl = this;

    var UserPosition = {
      lat: 46.781001,
      lng: 6.647128
    };

    ctrl.map = {
      maxbounds: {
        northEast: {
          lat: 46.776593276526796,
          lng: 6.6319531547147532
        },
        southWest: {
          lat: 46.789845089288413,
          lng: 6.6803974239963217
        }
      },
      tiles    : {
        url    : 'data/Tiles/{z}/{x}/{y}.png',
        options: {
          errorTileUrl: 'data/Tiles/error.png'
        }
      },
      defaults : {
        scrollWheelZoom   : true,
        maxZoom           : 18,
        minZoom           : 11,
        attributionControl: false
      },
      center   : {
        lat : UserPosition.lat,
        lng : UserPosition.lng,
        zoom: 16
      },
      markers  : {
        user: {
          lat : UserPosition.lat,
          lng : UserPosition.lng,
          icon: Icons.user()
        }
      }
    };

    PoiGeo.getPath().then(function(success) {
      ctrl.map.path = {
        data : success.data,
        style: {
          color : 'red',
          weigth: 6
        }
      }
    }, function(error) {
      $log.warn(error);
    });

    leafletData.getMap('map').then(function(map) {
      $log.debug(map);
    }).catch(function(error) {
      $log.warn(error);
    });

    ctrl.launchAR = function () {
      try {
        Ionicitude.launchAR()
          .then(loadWorldOuting)
          .catch(handleError);
      } catch (e) {
        $log.warn(e);
        $cordovaToast.showShortBottom("Device not supported !");
      }
    };

    ctrl.data = outingData;

    function handleError(error) {
      $log.error(error);
    }

    function loadWorldOuting(success) {
      $log.debug('World loaded');

      var promises = [
        PoiGeo.getPath(),
        PoiGeo.getPoints()
      ];

      return $q.all(promises).then(function(results) {
        WorldActions.execute('loadOuting', {
          path: results[0].data,
          pois: results[1].data
        });
      });
    }
  }
})();
