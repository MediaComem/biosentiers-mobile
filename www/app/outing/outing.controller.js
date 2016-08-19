/**
 * Created by Mathias on 29.03.2016.
 */
(function () {
  'use strict';

  angular
    .module('app')
    .controller('OutingCtrl', OutingCtrl);

  function OutingCtrl(Ionicitude, outingData, $cordovaToast, POIGeo, leafletData, $http, $ionicPlatform, $scope) {
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
          icon: {
            iconUrl   : 'img/icons/user.png',
            iconSize  : [16, 16], // size of the icon
            iconAnchor: [8, 8] // point of the icon which will correspond to marker's location
          }
        }
      }
    };

    $http.get('data/path.json').then(function (success) {
        console.log(success.data);
        ctrl.map.path = {
          data : success.data,
          style: {
            color : 'red',
            weigth: 6
          }
        }
      }, function (error) {
        console.log(error);
      }
    );

    leafletData.getMap('map')
      .then(function (map) {
        console.log(map);
      })
      .catch(function (error) {
        console.log(error);
      });

    ctrl.launchAR = function () {
      try {
        Ionicitude.launchAR()
          .then(POIGeo.getPoints)
          .then(worldLoaded)
          .catch(handleError);
      } catch (e) {
        console.log(e);
        $cordovaToast.showShortBottom("Device not supported !");
      }
    };

    ctrl.data = outingData;

    function handleError(error) {
      console.log('World not loaded', error);
    }

    function worldLoaded(success) {
      console.log('World loaded', success);
      Ionicitude.callJavaScript('World.loadPoints(' + angular.toJson(success.data) + ')');
    }
  }
})();
