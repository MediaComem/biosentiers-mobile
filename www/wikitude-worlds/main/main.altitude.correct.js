/**
 * Created by Mathias Oberson on 03.02.2017.
 */
(function() {
  'use strict';
  angular
    .module('ar')
    .service('Altitude', Altitude);

  function Altitude() {
    return {
      /**
       * Returns a corrected altitude depending on the plaform on which the app is running.
       * In fact, there is a bug on Android where the altitude returned is not the actual altitude
       * @return {Number} The corrected altitude
       */
      correct: function(altitude) {
        if (ionic.Platform.isAndroid()) {
          altitude += 50;
        }
        return altitude;
      }
    }
  }
})();
