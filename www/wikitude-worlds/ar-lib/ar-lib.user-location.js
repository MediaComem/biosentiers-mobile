/**
 * Created by Mathias on 08.06.2016.
 */
(function () {
  'use strict';
  angular
    .module('ARLib')
    .factory('UserLocation', fnUserLocation);

  function fnUserLocation(turf) {

    /**
     * @param lon
     * @param lat
     * @param alt
     * @constructor
     */
    function UserLocation(lon, lat, alt) {
      this.type = "Feature";
      this.properties = {};
      this.geometry = {
        type       : "Point",
        coordinates: [lon, lat, alt]
      }
    }

    // Static
    UserLocation.current = null;
    UserLocation.last = null;
    UserLocation.update = update;
    UserLocation.updateLast = updateLast;
    UserLocation.movingDistance = movingDistance;

    //Method
    UserLocation.prototype.lon = lon;
    UserLocation.prototype.lat = lat;
    UserLocation.prototype.alt = alt;
    UserLocation.prototype.literal = literal;

    return UserLocation;

    ////////////////////

    function update(lon, lat, alt) {
      console.log('setting new current position');
      UserLocation.current = new UserLocation(lon, lat, alt);
      UserLocation.last === null && updateLast();
    }

    function updateLast() {
      console.log('setting last position');
      UserLocation.last = UserLocation.current;
    }

    function movingDistance() {
      return turf.distance(UserLocation.current, UserLocation.last) * 1000;
    }

    function lon() {
      return this.geometry.coordinates[0];
    }

    function lat() {
      return this.geometry.coordinates[1];
    }

    function alt() {
      return this.geometry.coordinates[2];
    }

    function literal() {
      return 'lon: ' + this.lon() + ', lat: ' + this.lat() + ', alt: ' + this.alt();
    }

  }
})();
