/**
 * Created by Mathias on 25.08.2016.
 * This is the controller for the Big Map modal.
 * It handles showing the points, and further interaction with the bigmap.
 */
(function () {
  'use strict';
  angular
    .module('big-map-modal')
    .controller('BigMapCtrl', BigMapCtrl);

  function BigMapCtrl(Icons, $log, leafletData, BigMapModal, Outing, turf, UserLocation, $scope) {
    var ctrl = this, map = null;

    // If the controller is active, that means that it's the BigMapModal that's loaded.
    // So, the Modals.closeCurrent closes the BigMap Modal.
    ctrl.close = BigMapModal.close;
    ctrl.spec = {
      center : {
        lat : UserLocation.current.lat(),
        lng : UserLocation.current.lon(),
        zoom: 17
      },
      markers: {},
      geojson: {}
    };

    leafletData.getMap('bigmap').then(function (result) {
      map = result;
      updateVisiblePoints();
      $scope.$on('leafletDirectiveMap.bigmap.moveend', updateVisiblePoints);
    }).catch(function (error) {
      $log.error(error);
    });

    ////////////////////

    function updateVisiblePoints() {
      var screen = getScreenPolygon(map.getBounds());
      console.log(screen);
      debugScreenPoly(screen);
      // var poiToShow = getPointsToShow(screen);
      // console.log(poiToShow.length);
      // updateMarkers(poiToShow);
    }

    function debugScreenPoly(screen) {
      ctrl.spec.geojson.poly = {
        data: screen
      };
      console.log(ctrl.spec);
    }

    function getScreenPolygon(bounds) {
      console.log(bounds);
      var NE = bounds._northEast;
      var SW = bounds._southWest;
      return turf.helpers.polygon([[
        [NE.lng, NE.lat],
        [NE.lng, SW.lat],
        [SW.lng, SW.lat],
        [SW.lng, NE.lat],
        [NE.lng, NE.lat]
      ]]);
    }

    function getPointsToShow(poly) {
      var toShow = [];
      var points = Outing.getPois();
      console.log(points);
      _.each(points, function (point) {
        if (turf.inside(point, poly)) {
          $log.info('is in screen visibility');
          toShow.push(point);
        }
      });
      return toShow;
    }

    function updateMarkers(pointsArray) {
      _.each(pointsArray, function (point) {
        ctrl.spec.markers[point.properties.id_poi] = {
          lat : point.geometry.coordinates[1],
          lng : point.geometry.coordinates[0],
          icon: Icons.get(point.properties.theme_name)
        };
      })
    }
  }
})();
