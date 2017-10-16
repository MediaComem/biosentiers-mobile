/**
 * Created by Mathias Oberson on 03.02.2017.
 */
(function() {
  'use strict';
  angular
    .module('ar-view')
    .service('Location', LocationClass);

  function LocationClass() {
    /**
     * The class representing a UserLocation.
     * @param lon The longitude of the UserLocation
     * @param lat The latitude of the UserLocation
     * @param alt The altitude of the UserLocation
     * @param acc The accuracy of the UserLocation. The value is either 1, 2 or 3 for LOW, MEDIUM or HIGH
     * @constructor
     */
    function Location(lon, lat, alt, acc) {
      this.type = 'Feature';
      this.properties = {
        accuracy: acc
      };
      this.geometry = {
        type       : 'Point',
        coordinates: [lon, lat, alt]
      };
    }

    Location.prototype.clone = function() {
      return new Location(this.lon, this.lat, this.alt);
    };

    // Getters
    Object.defineProperties(Location.prototype, {
      'lon': {get: getLon},
      'lat': {get: getLat},
      'alt': {get: getAlt},
      'acc': {get: getAccuracy}
    });

    return Location;

    ////////////////////

    function getLon() {
      return this.geometry.coordinates[0];
    }

    function getLat() {
      return this.geometry.coordinates[1];
    }

    function getAlt() {
      return this.geometry.coordinates[2];
    }

    function getAccuracy() {
      return this.properties.accuracy;
    }

  }
})();
