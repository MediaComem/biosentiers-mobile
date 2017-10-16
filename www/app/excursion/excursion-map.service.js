/**
 * Created by Mathias Oberson on 28.04.2017.
 * This service is responsible for the configuration of the map visible in an excursion page.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .factory('ExcursionMapConfig', ExcursionMapConfigService);

  function ExcursionMapConfigService(MapIcons, leafletBoundsHelpers, $log, turf) {
    // Flag used for the 'once' option of the setUserLocation() method
    var TAG             = "[ExcursionMapConfig] ",
        hasBeenCentered = false;

    /**
     * Creates the configuration object with the basic and/or static values.
     * En excursion map is centered by default in the center of Yverdon-les-Bains.
     * The tiles are local ones, located in the www/tiles.
     * The zonn level can go from 11 to 18 and their is no controls visible.
     * Call:
     * * setUserLocation to put a marker at the user's location
     * * setPath to show the path on the map
     * * setZones to show the zones on the map
     * * setExtremityPoints to show the starting and ending point on the map
     * @constructor
     */
    function ExcursionMapConfig() {
      this.geojson = {};
      this.markers = {};
      this.bounds = {};
      this.center = {};
      this.maxbounds = {
        northEast: {
          lat: 46.776593276526796,
          lng: 6.6319531547147532
        },
        southWest: {
          lat: 46.789845089288413,
          lng: 6.6803974239963217
        }
      };
      this.tiles = {
        url    : 'tiles/{z}/{x}/{y}.png',
        options: {
          errorTileUrl: 'tiles/error.png'
        }
      };
      this.defaults = {
        scrollWheelZoom   : true,
        maxZoom           : 18,
        minZoom           : 11,
        attributionControl: false
      }
    }

    // Defines the object methods
    ExcursionMapConfig.prototype.setUserLocation = setUserLocation;
    ExcursionMapConfig.prototype.setPath = setPath;
    ExcursionMapConfig.prototype.setZones = setZones;
    ExcursionMapConfig.prototype.setExtremityPoints = setExtremityPoints;
    ExcursionMapConfig.prototype.setBoundsFromGeoJson = setBoundsFromGeoJson;

    return ExcursionMapConfig;

    ////////////////////

    /**
     * Sets the user location on the map.
     * This means creating (or updating) a marker for the user on the map at the user's location.
     * If the center argument is passed 'never', the map won't be centered on the user's location.
     * If you pass nothing or 'alway', the map will be centered each time the method is called.
     * You can also pass the value 'once' for the map to be centered only the first time the function is called.
     * @param {{lat: Number, lng: Number}} location An object with a lat and lng property
     * @param {{center: String}} options An object representing the desired options
     */
    function setUserLocation(location, options) {
      if (typeof options === "undefined" || typeof options.center === 'undefined') options.center = 'always';
      if (typeof location === "undefined") throw new TypeError("ExcursionMapConfig.setUserLocation - mandatory 'location' argument is undefined.");
      $log.info(TAG + 'setUserLocation', this, location);
      if (typeof this.markers.user !== "undefined") {
        $log.log(TAG + 'setUserLocation - updating the marker');
        this.markers.user.lat = location.lat;
        this.markers.user.lng = location.lng;
      } else {
        $log.log(TAG + 'setUserLocation - creating the marker');
        this.markers.user = {
          lat : location.lat,
          lng : location.lng,
          icon: MapIcons.user
        };
      }
      if (options.center === 'always' || (options.center === 'once' && !hasBeenCentered)) {
        this.center = {
          lat : location.lat,
          lng : location.lng,
          zoom: 16
        };
        hasBeenCentered = true;
      }
    }

    /**
     * Takes a path GeoJSON object and sets it as the value of the geojson.path property of this map config.
     * @param {GeoJSON} path A GeoJSON object
     */
    function setPath(path) {
      $log.info(TAG + 'setPath', path);
      if (path) {
        this.geojson.path = {
          data : path,
          style: {
            weight: 2,
            color : 'red'
          }
        }
      }
    }

    /**
     * Takes a zones GeoJSON object and sets it as the value of the geojson.zones property of this map config.
     * @param {GeoJSON} zones A GeoJSON object
     */
    function setZones(zones) {
      $log.log(TAG + 'setZones', zones);
      if (zones) {
        this.geojson.zones = {
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

    /**
     * Sets the starting and ending point of the excursion.
     * The points argument must be an object with at least a start and an end property.
     * Each of these properties must be a valid GeoJSON object representing a Point.
     * @param {{start: GeoJSON, end: GeoJSON}} points An object containing GeoJSON Point objects.
     */
    function setExtremityPoints(points) {
      $log.log(TAG + 'setExtremityPoints', points);
      if (points) {
        this.markers.start = {
          lat: points.start.geometry.coordinates[1],
          lng: points.start.geometry.coordinates[0]
        };
        this.markers.end = {
          lat: points.end.geometry.coordinates[1],
          lng: points.end.geometry.coordinates[0]
        };
      }
    }

    function setBoundsFromGeoJson(geojson) {
      var bbox = turf.bbox(geojson);
      this.bounds = leafletBoundsHelpers.createBoundsFromArray([[bbox[1], bbox[0]], [bbox[3], bbox[2]]]);
    }
  }
})();
