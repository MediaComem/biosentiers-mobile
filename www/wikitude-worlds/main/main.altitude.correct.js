/**
 * Created by Mathias Oberson on 03.02.2017.
 */
(function() {
  'use strict';
  angular
    .module('ar')
    .service('Altitude', Altitude);

  function Altitude(UserLocation, $log) {
    var altitude = {
      unknown         : AR.CONST.UNKNOWN_ALTITUDE,
      correct         : correct,
      getRelativeDelta: getRelativeDelta,
      setFixedAltitude: setFixedAltitude
    };

    var altitudeModifiers = {
      'bird'     : 10,
      'flower'   : -1,
      'tree'     : 0,
      'butterfly': 1,
      'extremity': -1
    };

    return altitude;

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

    /**
     * Gets the specific relative altitude delta for the given theme.
     * @param {String} theme The name of the theme for which the detla should be retrievfetched
     * @return {number} The relative altitude delta
     */
    function getRelativeDelta(theme) {
      return altitudeModifiers.hasOwnProperty(theme) ? altitudeModifiers[theme] : 0;
    }

    /**
     * Sets the altitude relative to the user for the given arPoi.
     * @param {ArBaseMarker} arPoi The ArPoi whose altitude should be changed.
     */
    function setFixedAltitude(arPoi) {
      $log.log('ArView:updateArPoisAltitude:previous altitude for POI n°' + arPoi.id, arPoi.location.altitude);
      if (UserLocation.real.alt === altitude.unknown || arPoi.relativeAltitudeDelta === altitude.unknown) {
        arPoi.location.altitude = altitude.unknown;
      } else {
        arPoi.location.altitude = UserLocation.real.alt + arPoi.relativeAltitudeDelta;
      }
      $log.log('ArView:updateArPoisAltitude:new altitude', arPoi.location.altitude);
    }
  }
})();
