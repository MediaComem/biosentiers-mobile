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

    //Getters
    Object.defineProperties(service, {
      'lon': {get: lon},
      'lat': {get: lat},
      'alt': {get: alt}
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
      service.real = wikitudePositionToGeoJson(lon, lat, alt);
      realLocationSubject.onNext(service.real);

      // Only update the spaced location the first time, or if the user has moved beyond the threshold.
      if (firstLocation || movingDistance() > movingDistanceThreshold) {
        service.spaced = angular.copy(service.real);
        spacedLocationSubject.onNext(service.spaced);

        if (!firstLocation) {
          $log.debug('User has moved ' + movingDistance() + 'm (more than ' + movingDistanceThreshold + 'm)');
        }
      }
    }

    function movingDistance() {
      return service.spaced ? turf.distance(service.real, service.spaced) * 1000 : 0;
    }

    function lon() {
      return service.real ? service.real.geometry.coordinates[0] : undefined;
    }

    function lat() {
      return service.real ? service.real.geometry.coordinates[1] : undefined;
    }

    function alt() {
      return service.real ? service.real.geometry.coordinates[2] : undefined;
    }

    function wikitudePositionToGeoJson(lon, lat, alt) {
      return {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [ lon, lat, alt ]
        }
      };
    }
  }
})();
