/**
 * Created by Mathias on 08.06.2016.
 */
(function () {
  'use strict';
  angular
    .module('ar-view')
    .factory('UserLocation', UserLocationService);

  function UserLocationService($log, rx, turf) {

    var movingDistanceThreshold = 20;

    var realLocationSubject = new rx.ReplaySubject(1),
        spacedLocationSubject = new rx.ReplaySubject(1);

    var service = {
      real: null,
      spaced: null,
      update: update,
      hasLocation: hasLocation,
      realObs: realLocationSubject.asObservable(),
      spacedObs: spacedLocationSubject.asObservable()
    };

    function Location(lon, lat, alt) {
      this.type = 'Feature';
      this.properties = {};
      this.geometry = {
        type: 'Point',
        coordinates: [ lon, lat, alt ]
      };
    }

    Location.prototype.clone = function() {
      return new Location(this.lon, this.lat, this.alt);
    };

    // Getters
    Object.defineProperties(Location, {
      'lon': { get: getLon },
      'lat': { get: getLat },
      'alt': { get: getAlt }
    });

    return service;

    ////////////////////

    function hasLocation() {
      return !_.isNil(service.real);
    }

    function update(lon, lat, alt) {
      $log.debug('User location changed to longitude ' + lon + ', latitude ' + lat + ', altitude ' + alt);

      var firstLocation = !hasLocation();

      // Always update the real location.
      service.real = new Location(lon, lat, alt);
      realLocationSubject.onNext(service.real);

      // Only update the spaced location the first time, or if the user has moved beyond the threshold.
      if (firstLocation || movingDistance() > movingDistanceThreshold) {
        service.spaced = service.real.clone();
        spacedLocationSubject.onNext(service.spaced);

        if (!firstLocation) {
          $log.debug('User has moved ' + movingDistance() + 'm (more than ' + movingDistanceThreshold + 'm)');
        }
      }
    }

    function movingDistance() {
      return service.spaced ? turf.distance(service.real, service.spaced) * 1000 : 0;
    }

    function getLon() {
      return this.geometry.coordinates[0];
    }

    function getLat() {
      return this.geometry.coordinates[1];
    }

    function getAlt() {
      return this.geometry.coordinates[2];
    }
  }
})();
