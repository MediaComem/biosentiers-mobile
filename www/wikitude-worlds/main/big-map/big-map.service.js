/**
 * Created by Mathias on 31.08.2016.
 */
(function () {
	'use strict';
	angular
		.module('big-map')
		.factory('BigMap', BigMapService);

	function BigMapService(Filters, $log, MapIcons, Excursion, turf, UserLocation) {
		var service = {
			config          : {},
			updateMapMarkers: updateMapMarkers,
			setMap          : setMap
		};

		var map                 = null,
		    defaultMarkers      = {
			    user: {
				    lat : UserLocation.real.lat,
				    lng : UserLocation.real.lon,
				    icon: MapIcons.user
			    },
			    start: {
			    	lat: Excursion.getStartPoint().geometry.coordinates[1],
				    lng: Excursion.getStartPoint().geometry.coordinates[0],
						icon: MapIcons.start
			    },
			    end: {
			    	lat: Excursion.getEndPoint().geometry.coordinates[1],
				    lng: Excursion.getEndPoint().geometry.coordinates[0],
						icon: MapIcons.end
			    }
		    },
		    clusterLayerOptions = {
			    disableClusteringAtZoom: 18
		    };

		initialize();

		return service;

		////////////////////

		/**
		 * Sets the config property of the service
		 */
		function initialize() {
			service.config = {
				center : {
					lat : UserLocation.real.lat,
					lng : UserLocation.real.lon,
					zoom: 17
				},
				markers: defaultMarkers,
				geojson: {},
				layers : {
					overlays: {
						markers  : {
							name        : "Marqueurs",
							type        : "markercluster",
							visible     : true,
							layerOptions: clusterLayerOptions
						}
					}
				}
			};
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
				$log.log(_.size(service.config.markers));
				var poisToShow = getMapMarkersToShow(getScreenPolygon());
				addMapMarkers(Filters.filterPois(poisToShow));
				$log.log(_.size(service.config.markers));
				return service.config.markers;
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
			var pois = Excursion.getPois();
			return _.filter(pois, function (poi) {
				return turf.inside(poi, poly);
			});
		}

		/**
		 * Adds new markers on the map, based on the informations in the poisToAdd argument.
		 * @param poisToAdd An Array containing GeoJSON Point object.
		 */
		function addMapMarkers(poisToAdd) {
			_.each(poisToAdd, function (poi) {
				service.config.markers[poi.properties.id_poi] = {
					layer: 'markers',
					lat  : poi.geometry.coordinates[1],
					lng  : poi.geometry.coordinates[0],
					icon : MapIcons.get(poi.properties.theme_name)
				};
			})
		}

		/**
		 * Resets the map markers to their original state.
		 * That is : only the user marker is visible.
		 */
		function resetMapMarkers() {
			service.config.markers = angular.copy(defaultMarkers);
		}
	}
})();
