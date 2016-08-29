/**
 * Created by Mathias on 25.08.2016.
 */
(function () {
  'use strict';
  angular
    .module('big-map-modal')
    .controller('BigMapCtrl', BigMapCtrl);

  function BigMapCtrl(leafletData, BigMapModal, POIData, turf, UserLocation, $scope) {
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
      markers: {}
    };

    leafletData.getMap().then(function (result) {
      map = result;
      updateVisiblePoints();
      $scope.$on('leafletDirectiveMap.moveend', updateVisiblePoints);
    });

    ////////////////////

    function updateVisiblePoints() {
      var screen = getScreenPolygon(map.getBounds());
      var poiToShow = getPointsToShow(screen);
      console.log(poiToShow.length);
      updateMarkers(poiToShow);
    }

    function getScreenPolygon(bounds) {
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
      var points = POIData.getPois();
      _.each(points, function (point) {
        if (turf.inside(point, poly)) {
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
          icon: icons[point.properties.theme_name]
        };
      })
    }
  }
})();
