/**
 * Created by Mathias Oberson on 28.04.2017.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .factory('OutingMap', OutingMapService);

  function OutingMapService(MapIcons, $log, turf) {
    var service = {
      get config() { return getConfig() },
      set userLocation(location) { setUserLocation(location) },
      set path(path) { setPath(path) },
      set zones(zones) { setZones(zones) },
      set extremityPoints(points) { setExtremityPoints(points) },
    };

    var mapConfig = {
      geojson  : {},
      markers  : {},
      bounds: {},
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
      }
    };

    return service;

    ////////////////////

    function getConfig() {
      return mapConfig;
    }

    function setUserLocation(location) {
      if (location) {
        mapConfig.center = {
          lat : location.lat,
          lng : location.lng,
          zoom: 16
        };
        mapConfig.markers.user = {
          lat : location.lat,
          lng : location.lng,
          icon: MapIcons.user
        }
      }
    }

    function setPath(path) {
      $log.info('OutingMap - setPath', path);
      if (path) {
        mapConfig.geojson.path = {
          data : path,
          style: {
            weight: 2,
            color : 'red'
          }
        }
      }
    }

    function setZones(zones) {
      if (zones) {
        mapConfig.geojson.zones = {
          data : zones,
          style: {
            fillColor  : "green",
            weight     : 2,
            opacity    : 1,
            color      : 'green',
            fillOpacity: 0.2
          }
        }
      }
    }

    function setExtremityPoints(points) {
      if (points) {
        mapConfig.markers.start = {
          lat: points.start.geometry.coordinates[1],
          lng: points.start.geometry.coordinates[0]
        };
        mapConfig.markers.end = {
          lat: points.end.geometry.coordinates[1],
          lng: points.end.geometry.coordinates[0]
        };
      }
    }
  }
})();