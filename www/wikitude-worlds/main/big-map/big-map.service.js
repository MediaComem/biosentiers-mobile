/**
 * Created by Mathias on 31.08.2016.
 */
(function() {
  'use strict';
  angular
    .module('big-map')
    .factory('BigMap', BigMapService);

  function BigMapService(Filters, $log, MapIcons, Excursion, turf, UserLocation) {
    var bigMap = {
      config          : {},
      updateMapMarkers: updateMapMarkers,
      setMap          : setMap,
      updateUserMarker: updateUserMarker,
      centerOnUser    : centerOnUser,
      fitOnPath       : fitOnPath
    };

    var pathBounds          = null,
        map                 = null,
        defaultMarkers      = {
          start: {
            lat : Excursion.startPoint.geometry.coordinates[1],
            lng : Excursion.startPoint.geometry.coordinates[0],
            icon: MapIcons.start
          },
          end  : {
            lat : Excursion.endPoint.geometry.coordinates[1],
            lng : Excursion.endPoint.geometry.coordinates[0],
            icon: MapIcons.end
          }
        },
        clusterLayerOptions = {
          disableClusteringAtZoom: 18
        };

    $log.log('BigMapService:defaultMarkers', angular.copy(defaultMarkers));

    $log.log('Turf Center of Path', turf.center(Excursion.pathGeoJson));

    initialize();

    // On the first real location, updates the defaultMarkers object to add the user marker
    UserLocation.realObs.first().subscribe(function() {
      angular.extend(defaultMarkers, {
        user: {
          lat : UserLocation.real.lat,
          lng : UserLocation.real.lon,
          icon: MapIcons.user
        }
      });

      // Change the center of the bigmap to the user's position
      bigMap.config.center.lat = UserLocation.real.lat;
      bigMap.config.center.lng = UserLocation.real.lon;
    });

    UserLocation.realObs.subscribe(updateUserMarker);

    return bigMap;

    ////////////////////

    /**
     * Sets the config property of the service
     */
    function initialize() {
      angular.extend(bigMap.config, {
        markers: defaultMarkers,
        // By default, the map center is the starting point
        center : {
          lng : Excursion.startPoint.geometry.coordinates[0],
          lat : Excursion.startPoint.geometry.coordinates[1],
          zoom: 17
        },
        layers : {
          overlays: {
            markers: {
              name        : "Marqueurs",
              type        : "markercluster",
              visible     : true,
              layerOptions: clusterLayerOptions
            }
          }
        }
      });
    }

    /**
     * Stores the leaflet map for the BigMap in the service.
     * @param leafletMap The leaflet map to be used as the BigMap
     */
    function setMap(leafletMap) {
      leafletMap !== null && (map = leafletMap);
    }

    /**
     * Updates the visible map markers on the BigMap.
     * First, get the screen bounds, then loads all the pois on this bounds.
     * Reset the map markers to show only the user one, then adds the new markers.
     */
    function updateMapMarkers() {
      if (map !== null) {
        resetMapMarkers();
        $log.log(_.size(bigMap.config.markers));
        var poisToShow = getMapMarkersToShow(getScreenPolygon());
        addMapMarkers(Filters.filterPois(poisToShow));
        $log.log(_.size(bigMap.config.markers));
        return bigMap.config.markers;
      } else {
        $log.error('No map available. Try to call the BigMap.setMap() method, passing it a valid leaflet map.');
      }
    }

    /**
     * Gets the bounds of the currently visible par of the map, directly from the map.
     * Then creates a GeoJSON Polygon object (with turf) and returns this Polygon object.
     * @return {Object} A GeoJSON Polygon object representing
     */
    function getScreenPolygon() {
      var bounds = map.getBounds();
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

    /**
     * Gets the pois that are inside the given Polygon GeoJSON Object.
     * The pois are retrieved from the Excursion
     * service.
     * @param poly
     * @return {Array} An Array that contains all the GeoJSON Point that are insode the polygon.
     */
    function getMapMarkersToShow(poly) {
      var pois = Excursion.pois;
      return _.filter(pois, function(poi) {
        return turf.inside(poi, poly);
      });
    }

    /**
     * Adds new markers on the map, based on the informations in the poisToAdd argument.
     * @param poisToAdd An Array containing GeoJSON Point object.
     */
    function addMapMarkers(poisToAdd) {
      _.each(poisToAdd, function(poi) {
        // We use a base64 encoded id as the marker id, since Angular Leaflet does not accept '-' in marker's id.
        bigMap.config.markers[btoa(poi.properties.id)] = {
          layer: 'markers',
          lat  : poi.geometry.coordinates[1],
          lng  : poi.geometry.coordinates[0],
          icon : MapIcons.get(poi.properties.theme)
        };
      })
    }

    /**
     * Resets the map markers to their original state.
     * That is : only the user marker is visible.
     */
    function resetMapMarkers() {
      bigMap.config.markers = angular.copy(defaultMarkers);
    }

    /**
     * Updates the position of the user marker, based on the UserLocation.real location.
     */
    function updateUserMarker() {
      if (bigMap.config.markers.hasOwnProperty('user')) {
        $log.log('BigMapService:updateUserMarker');
        bigMap.config.markers.user.lat = UserLocation.real.lat;
        bigMap.config.markers.user.lng = UserLocation.real.lon;
      }
    }

    /**
     * Updates the center of the map so that it matches the latest user's location value.
     */
    function centerOnUser() {
      bigMap.config.center = {
        lat : UserLocation.real.lat,
        lng : UserLocation.real.lon,
        zoom: 17
      };
    }

    /**
     * Fit the map to the excursion path.
     */
    function fitOnPath() {
      if (map !== null) {
        if (pathBounds === null) {
          Excursion.excursionChangeObs.subscribe(function(value) {
            pathBounds = L.geoJson(value.path).getBounds();
          });
        }
        map.fitBounds(pathBounds);
      }
    }
  }
})();
