/**
 * Created by Mathias Oberson on 03.02.2017.
 */
(function() {
  'use strict';
  angular
    .module('ar')
    .service('Altitude', Altitude);

  function Altitude(UserLocation, $log) {
    var service = {
      correct         : correct,
      getFixedAltitude: getFixedAltitude,
      getRelativeDelta: getRelativeDelta
    };

    var altitudeModifiers = {
      'bird'     : 10,
      'flower'   : -1,
      'tree'     : 0,
      'butterfly': 1
    };

    return service;

    ////////////////////

    /**
     * Returns a corrected altitude depending on the plaform on which the app is running.
     * In fact, there is a bug on Android where the altitude returned is not the actual altitude
     * @return {Number} The corrected altitude
     */
    function correct(altitude) {
      if (ionic.Platform.isAndroid()) {
        altitude += 50;
      }
      return altitude;
    }

    function getFixedAltitude(delta) {
      $log.log('Altitude:getFixedAltitude:UserLocation current altitude', UserLocation.real.alt);
      $log.log('Altitude:getFixedAltitude:Altitude delta', delta);
      var fixedAlt = UserLocation.real.alt + delta;
      $log.log('Altitude:getFixedAltitude:Fixed altitude', fixedAlt);
      return fixedAlt;
    }

    function getRelativeDelta(theme) {
      return altitudeModifiers.hasOwnProperty(theme) ? altitudeModifiers[theme] : 0;
    }
  }
})();
