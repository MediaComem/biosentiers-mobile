/**
 * Created by Mathias on 31.08.2016.
 */
(function () {
  'use strict';
  angular
    .module('bigmap')
    .factory('BigMap', BigMapService);

  function BigMapService(Icons, $log, Poi, turf, UserLocation) {
    var service = {
      config             : {},
      updateVisiblePoints: updateVisiblePoints,
      setMap             : setMap
    };

    var map        = null,
        userMarker = {
          lat : UserLocation.current.lat,
          lng : UserLocation.current.lon,
          icon: Icons.user
        };

    initialize();

    return service;

    ////////////////////

    function initialize() {
      service.config = {
        center : {
          lat : UserLocation.current.lat,
          lng : UserLocation.current.lon,
          zoom: 17
        },
        markers: {},
        geojson: {},
        layers : {
          overlays: {
            points  : {
              name   : "Points d'intérêt",
              type   : "markercluster",
              visible: true
            },
            Oiseaux : {
              name   : "Oiseaux",
              type   : "markercluster",
              visible: false
            },
            Flore   : {
              name   : "Flore",
              type   : "markercluster",
              visible: true
            },
            Papillon: {
              name   : "Papillon",
              type   : "markercluster",
              visible: true
            }
          }
        }
      };
    }

    function setMap(leafletMap) {
      leafletMap !== null && (map = leafletMap);
    }

    function updateVisiblePoints() {
      if (map !== null) {
        var screenPoly = getScreenPolygon(map.getBounds());
        // debugScreenPoly(screen);
        var poisToShow = getPointsToShow(screenPoly);
        updateMarkers(poisToShow);
      } else {
        $log.error('No map available. Try to call the BigMap.setMap() method, passing it a valid leaflet map.');
      }
    }

    function debugScreenPoly(screenPoly) {
      service.config.geojson.poly = {
        data: screenPoly
      };
      console.log(service.config);
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
      var points = Poi.getPois();
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
      resetMarkers();
      _.each(pointsArray, function (point) {
        service.config.markers[point.properties.id_poi] = {
          layer: 'points',
          lat  : point.geometry.coordinates[1],
          lng  : point.geometry.coordinates[0],
          icon : Icons.get(point.properties.theme_name)
        };
      })
    }

    function resetMarkers() {
      service.config.markers = {}
    }
  }
})();
