/**
 * Created by Mathias on 29.03.2016.
 */
(function() {
  'use strict';

  angular
    .module('app')
    .controller('ExcursionCtrl', ExcursionCtrl);

  function ExcursionCtrl(ActivityTracker, $cordovaGeolocation, $cordovaToast, Ionicitude, leafletData, $log, ExcursionMapConfig, Excursions, excursionData, PoiGeo, $q, SeenPoisData, $scope, $timeout, WorldActions) {
    $log.log('excursion data', excursionData);

    var excursion = this;
    var geoData, positionWatcher;

    excursion.actionButtonClick = actionButtonClick;
    excursion.centerMapOnZone = centerMapOnZone;
    excursion.openFabActions = openFabActions;
    excursion.zoneIsNotAvailable = zoneIsNotAvailable;
    excursion.togglePositionWatch = togglePositionWatch;

    excursion.data = excursionData;
    excursion.downloadProgress = "Télécharger";
    excursion.mapConfig = new ExcursionMapConfig;
    excursion.positionState = 'refresh';
    excursion.activeFAB = false;

    // $scope.$on('$ionicView.afterEnter', afterViewEnter);

    $scope.$on('$ionicView.beforeLeave', deactivatePositionWatch);

    PoiGeo.getExcursionGeoData(excursion.data.zones).then(loadExcursionData);

    Excursions.isNotNew(excursion.data);

    leafletData.getMap('map').then(function(map) {
      $log.info(map);
    }).catch(handleError);

    SeenPoisData.countFor(excursion.data.id).then(function(res) {
      excursion.nbSeenPoi = res;
    }).catch(handleError);

    SeenPoisData.seenPoiObs.subscribe(function(data) {
      $log.info('SeenPoisData: catched event - new poi has been seen', data);
      if (excursion.data.id === data.excursionId) excursion.nbSeenPoi = data.nbSeen;
    });

    ////////////////////

    function togglePositionWatch() {
      excursion.positionState === 'refresh' ? activatePositionWatch() : deactivatePositionWatch();
    }

    function zoneIsNotAvailable(zoneNb) {
      return !_.includes(excursion.data.zones, zoneNb);
    }

    function openFabActions() {
      excursion.activeFAB = !excursion.activeFAB;
    }

    function centerMapOnZone(zone) {
      $log.log('ExcursionCtrl - center map on zone', zone);
      var zoneGeoJson = getZone(zone);
      $log.log('centerMapOnZone', zoneGeoJson);
      excursion.mapConfig.setBoundsFromGeoJson(zoneGeoJson);
    }

    function getZone(zoneId) {
      return _.find(excursion.mapConfig.geojson.zones.data.features, function(zone) {
        return zone.properties.id_zone === zoneId;
      })
    }

    function loadExcursionData(excursionData) {
      geoData = excursionData;
      $log.info('getExcursionGeoData -  excursionGeoData', geoData);
      excursion.mapConfig.setPath(geoData.path);
      excursion.mapConfig.setZones(geoData.zones);
      excursion.mapConfig.setExtremityPoints(geoData.extremityPoints);
      excursion.mapConfig.setBoundsFromGeoJson(geoData.path);
    }

    function activatePositionWatch() {
      excursion.positionState = "searching";
      $log.info('ExcursionCtrl - Activating location watcher');
      positionWatcher = $cordovaGeolocation.watchPosition({
        timeout           : 10000,
        enableHighAccuracy: true
      });
      positionWatcher.then(null, positionError, positionUpdate);
    }

    function deactivatePositionWatch() {
      $log.info('ExcursionCtrl - Deactivating location watcher');
      positionWatcher && positionWatcher.cancel();
      delete excursion.mapConfig.markers.user;
      excursion.positionState = 'refresh';
    }

    function positionError(error) {
      $log.error('positionError', error);
      excursion.positionState = 'error';
      $timeout(function() {
        excursion.positionState = 'refresh';
      }, 1000);
    }

    function positionUpdate(position) {
      $log.info('getCurrentPosition', position);
      excursion.mapConfig.setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }, {center: 'once'});
      excursion.positionState = 'success';
      $timeout(function() {
        excursion.positionState = 'searching';
      }, 1000);
      $log.info(positionWatcher);
    }

    function actionButtonClick() {
      var actions = {
        pending: startExcursion,
        ongoing: resumeExcursion
      };
      actions[excursion.data.status]();
    }

    /**
     * Load and launch the AR World with the excursion's data, then changes the status of this excursion from "pending" to "ongoing".
     */
    function startExcursion() {
      return $q.when()
        .then(Ionicitude.launchAR)
        .then(loadWorldExcursion)
        .then(_.partial(Excursions.setOngoingStatus, excursion.data))
        .catch(handleError);
    }

    function resumeExcursion() {
      return $q.when()
        .then(startExcursion)
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
     * Load in the AR View the current excursion's data.
     * This means getting the GeoJSON for the path and the points, as well as retrieveing the
     * points that have already been seen.
     * When all these promises are resolved, a call to the AR function loadExcursion is made.
     */
    function loadWorldExcursion() {
      $log.debug('World loaded');

      var promises = [
        PoiGeo.getFilteredPoints(excursion.data.zones, excursion.data.themes),
        SeenPoisData.getAll(excursion.data.id)
      ];

      return $q.all(promises).then(function(results) {
        $log.log('ExcursionCtrl:loadWorldExcursion', results);
        var arData = {
          id             : excursion.data.id,
          themes         : excursion.data.themes,
          path           : geoData.path,
          extremityPoints: geoData.extremityPoints,
          pois           : results[0],
          seen           : _.map(results[1], 'poi_id')
        };
        $log.info('ExcursionCtrl:loadWorldExcursion:excursion.arData', arData);
        WorldActions.execute('loadExcursion', arData);
      });
    }


    // Zip download
    //TODO add to localdb that the download and unzip was sucessful
    // ctrl.getZip = function(excursionId) {
    //   downloader.init({folder: excursionId.toString(), unzip: true});
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
