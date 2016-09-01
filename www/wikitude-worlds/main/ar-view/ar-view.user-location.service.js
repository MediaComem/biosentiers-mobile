/**
 * Created by Mathias on 08.06.2016.
 */
(function () {
  'use strict';
  angular
    .module('ar-view')
    .factory('UserLocation', UserLocationService);

  function UserLocationService(rx, turf) {

    var currentLocationSubject = new rx.ReplaySubject(1);

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
    UserLocation.currentObs = currentLocationSubject.asObservable();
    UserLocation.last = null;
    UserLocation.update = update;
    UserLocation.backupCurrent = backupCurrent;
    UserLocation.movingDistance = movingDistance;
    UserLocation.debug = debug;

    //Method
    UserLocation.prototype.lon = lon;
    UserLocation.prototype.lat = lat;
    UserLocation.prototype.alt = alt;
    UserLocation.prototype.literal = literal;

    return UserLocation;

    ////////////////////

    function update(lon, lat, alt) {
      UserLocation.current = new UserLocation(lon, lat, alt);
      currentLocationSubject.onNext(UserLocation.current);
    }

    function backupCurrent() {
      UserLocation.last = angular.copy(UserLocation.current);
    }

    function movingDistance() {
      var distance = turf.distance(UserLocation.current, UserLocation.last) * 1000;
      console.log('distance parcourue', distance);
      return distance;
    }

    function debug() {
      return {
        current: UserLocation.current,
        last: UserLocation.last
      };
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
