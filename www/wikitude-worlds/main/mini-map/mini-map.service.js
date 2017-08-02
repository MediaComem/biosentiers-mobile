/**
 * Created by Mathias on 01.09.2016.
 */
(function() {
  'use strict';

  angular
    .module('mini-map')
    .factory('MiniMap', MiniMapService);

  function MiniMapService(MapIcons, $log, Excursion) {
    var zoom    = 17,
        service = {
          config          : {},
          addPath         : addPath,
          centerOnUser    : centerOnUser,
          updateMapMarkers: updateMapMarkers
        };

    initialize();

    Excursion.excursionChangeObs.subscribe(function() {
    // Excursion.excursionChangeObs.first().subscribe(function() {
      service.config.markers.start = {
        lat : Excursion.startPoint.geometry.coordinates[1],
        lng : Excursion.startPoint.geometry.coordinates[0],
        icon: MapIcons.start
      };
      service.config.markers.end = {
        lat : Excursion.endPoint.geometry.coordinates[1],
        lng : Excursion.endPoint.geometry.coordinates[0],
        icon: MapIcons.end
      };
    });

    return service;

    ////////////////////

    /**
     * Sets ths service config property
     */
    function initialize() {
      service.config = {
        tiles   : {
          url    : '../../tiles/{z}/{x}/{y}.png',
          options: {
            errorTileUrl: '../../tiles/error.png'
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
     * @param excursion A GeoJSON object containing a path property that reprensents the path to add.
     */
    function addPath(excursion) {
      service.config.geojson.path = {
        data : excursion.path,
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
      _.each(mapMarkerChanges.hidden, function(marker) {
        delete service.config.markers[marker.properties.id_poi];
      });
      _.each(mapMarkerChanges.shown, function(marker) {
        service.config.markers[marker.properties.id_poi] = {
          lat : marker.geometry.coordinates[1],
          lng : marker.geometry.coordinates[0],
          icon: MapIcons.get(marker.properties.theme_name)
        }
      });
      $log.log('updateMapMarkers', service.config);
    }

    /**
     * Centers the mini-map and the user marker to the real user's location.
     * @param realLocation The current user's Location
     */
    function centerOnUser(realLocation) {
      if (service.config.hasOwnProperty('center')) {
        $log.debug('Updating the minimap center');
        service.config.center.lat = realLocation.lat;
        service.config.center.lng = realLocation.lon;
      }
      if (service.config.markers.hasOwnProperty('user')) {
        $log.debug('Updating the minimap marker');
        service.config.markers.user.lat = realLocation.lat;
        service.config.markers.user.lng = realLocation.lon;
      }
    }
  }
})();
