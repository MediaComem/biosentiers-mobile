/**
 * Created by Mathias on 29.03.2016.
 */
(function() {
  'use strict';

  angular
    .module('app')
    .controller('OutingCtrl', OutingCtrl);

  function OutingCtrl(ActivityTracker, $cordovaToast, MapIcons, Ionicitude, $ionicPlatform, leafletData, $log, Outings, outingData, PoiGeo, $q, SeenPoisData, $scope, WorldActions) {
    var excursion = this;

    var UserPosition = {
      lat: 46.781001,
      lng: 6.647128
    };

    excursion.startOuting = startOuting;
    excursion.resumeOuting = resumeOuting;
    excursion.actionButtonClick = actionButtonClick;

    excursion.data = outingData;

    excursion.downloadProgress = "Télécharger";

    excursion.map = {
      geojson  : {},
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

    // PoiGeo.getPath().then(function(success) {
    //   excursion.map.geojson.path = {
    //     data : success,
    //     style: {
    //       color : 'red',
    //       weigth: 6
    //     }
    //   }
    // }).catch(handleError);
    //
    // PoiGeo.getZones(excursion.data.zones).then(function(zones) {
    //   $log.log('outingCtrl - getting the zones', zones);
    //   excursion.map.geojson.zones = {
    //     data: zones,
    //     style: {
    //       color: 'green',
    //       weight: 4
    //     }
    //   }
    // });

    PoiGeo.getExcursionGeoData(excursion.data.zones).then(function(excursionGeoData) {
      $log.info(excursionGeoData);
      excursion.map.geojson = {
        path : {
          data : excursionGeoData.path,
          style: {
            style: {
              color : 'red',
              weigth: 6
            }
          }
        },
        zones: {
          data : excursionGeoData.zones,
          style: {
            color : 'green',
            weight: 4
          }
        }
      };
    });

    leafletData.getMap('map').then(function(map) {
      $log.info(map);
    }).catch(handleError);

    Outings.isNotNew(excursion.data);

    SeenPoisData.countFor(excursion.data.id).then(function(res) {
      excursion.nbSeenPoi = res;
    }).catch(handleError);

    ////////////////////

    function actionButtonClick() {
      var actions = {
        pending: startOuting,
        ongoing: resumeOuting
      };
      actions[excursion.data.status]();
    }

    /**
     * Load and launch the AR World with the outing's data, then changes the status of this outing from "pending" to "ongoing".
     */
    function startOuting() {
      return $q.when()
        .then(Ionicitude.launchAR)
        .then(loadWorldOuting)
        .then(_.partial(Outings.setOngoingStatus, excursion.data))
        .catch(handleError);
    }

    function resumeOuting() {
      return $q.when()
        .then(startOuting)
        .then(ActivityTracker.logResume)
        .catch(handleError);
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
        PoiGeo.getFilteredPoints(excursion.data.zones, excursion.data.themes),
        SeenPoisData.getAll(excursion.data.id),
      ];

      return $q.all(promises).then(function(results) {
        $log.log(results);
        WorldActions.execute('loadOuting', {
          id    : excursion.data.id,
          themes: excursion.data.themes,
          path  : results[0],
          pois  : results[1],
          seen  : _.map(results[2], 'poi_id')
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
