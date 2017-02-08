/**
 * Created by Mathias on 29.03.2016.
 */
(function() {
  'use strict';

  angular
    .module('app')
    .controller('OutingCtrl', OutingCtrl);

  function OutingCtrl($cordovaToast, MapIcons, Ionicitude, $ionicPlatform, leafletData, $log, OutingClass, outingData, Outings, PoiGeo, $q, SeenPoisData, $scope, WorldActions) {
    var ctrl = this;

    var UserPosition = {
      lat: 46.781001,
      lng: 6.647128
    };

    ctrl.downloadProgress = "Télécharger";

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
          icon: MapIcons.user
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
    }).catch(handleError);

    leafletData.getMap('map').then(function(map) {
      $log.debug(map);
    }).catch(handleError);

    ctrl.startOuting = startOuting;

    ctrl.data = outingData;
    $log.log(ctrl.data);

    ////////////////////

    /**
     * Load and launch the AR World with the outing's data, then changes the status of this outing from "pending" to "ongoing".
     */
    function startOuting() {
      $q.when()
        .then(Ionicitude.launchAR)
        .then(loadWorldOuting)
        .then(flagAsOngoing)
        .catch(handleError);
    }

    function flagAsOngoing() {
      console.log('flagging');
      OutingClass.setOngoing(ctrl.data);
      // Outings.updateOne(ctrl.data);
      console.log(ctrl.data);
    }

    /**
     * Handles errors occuring.
     * An UnsupportedFeatureError could be raised by Ionicitude if the device doesn't support Wikitude.
     * For all the other errors, the error is logged and a toast is shown.
     * @param e
     */
    function handleError(e) {
      $log.error(e);
      if (e instanceof UnsupportedFeatureError) {
        $cordovaToast.showShortBottom("Device not supported !");
      } else {
        $cordovaToast.showShortBottom("Unknow error. Please check the logs.");
      }
    }

    /**
     * Load in the AR View the current outing's data.
     * This means getting the GeoJSON for the path and the points, as well as retrieveing the
     * points that have already been seen.
     * When all these promises are resolved, a call to the AR function loadOuting is made.
     */
    function loadWorldOuting() {
      $log.debug('World loaded');

      var promises = [
        PoiGeo.getPath(),
        PoiGeo.getPoints(),
        SeenPoisData.getAll(ctrl.data.id, true)
      ];

      return $q.all(promises).then(function(results) {
        $log.log(results);
        WorldActions.execute('loadOuting', {
          id  : ctrl.data.id,
          data: ctrl.data,
          path: results[0].data,
          pois: results[1].data,
          seen: _.map(results[2], 'poi_id')
        });
      });
    }


    // Zip download
    //TODO add to localdb that the download and unzip was sucessful
    // ctrl.getZip = function(outingId) {
    //   downloader.init({folder: outingId.toString(), unzip: true});
    //   downloader.get("http://knae.niloo.fr/testBirds.zip");
    //   document.addEventListener("DOWNLOADER_downloadProgress", function(event) {
    //     var data = event.data;
    //     $scope.$apply(function() {
    //       ctrl.downloadProgress = data[0] + ' %';
    //     });
    //   });
    //   document.addEventListener("DOWNLOADER_unzipSuccess", function(event) {
    //     $scope.$apply(function() {
    //       ctrl.downloadProgress = "Réussit";
    //     });
    //   });
    // }
  }
})();
