/**
 * Created by Mathias on 01.09.2016.
 */
(function () {
  'use strict';

  angular
    .module('mini-map')
    .factory('MiniMap', MiniMapService);

  function MiniMapService(MapIcons, $log) {
    var zoom    = 16,
        service = {
          config          : {},
          addPath         : addPath,
          updateMapMarkers: updateMapMarkers
        };

    initialize();

    return service;

    ////////////////////

    /**
     * Sets ths service config property
     */
    function initialize() {
      service.config = {
        tiles   : {
          url    : '../../data/Tiles/{z}/{x}/{y}.png',
          options: {
            errorTileUrl: '../../data/Tiles/error.png'
          }
        },
        defaults: {
          scrollWheelZoom   : false,
          touchZoom         : false,
          doubleClickZoom   : false,
          dragging          : false,
          attributionControl: false
        },
        center  : {
          lat : 46.781001,
          lng : 6.647128,
          zoom: zoom
        },
        markers : {
          user: {
            lat : 46.781001,
            lng : 6.647128,
            icon: MapIcons.user
          }
        },
        events  : {
          map: {
            enable: ['click'],
            logic : 'emit'
          }
        },
        geojson : {}
      };
    }

    /**
     * Adds the received path as a geojson layer on the config object for the minimap.
     * @param outing A GeoJSON object containing a path property that reprensents the path to add.
     */
    function addPath(outing) {
      service.config.geojson.path = {
        data : outing.path,
        style: {
          color : 'red',
          weigth: 6
        }
      };
    }

    /**
     * Updates the markers on the mini-map, following the changes passed as the argument.
     * @param mapMarkerChanges An object with at least a removed and added properties, that contains respectivly the map markers to delete and to add.
     */
    function updateMapMarkers(mapMarkerChanges) {
      $log.log(mapMarkerChanges);
      _.each(mapMarkerChanges.hidden, function (marker) {
        delete service.config.markers[marker.properties.id_poi];
      });
      _.each(mapMarkerChanges.shown, function (marker) {
        service.config.markers[marker.properties.id_poi] = {
          lat : marker.geometry.coordinates[1],
          lng : marker.geometry.coordinates[0],
          icon: MapIcons.get(marker.properties.theme_name)
        }
      });
      $log.log(service.config);
    }

  }
})();
