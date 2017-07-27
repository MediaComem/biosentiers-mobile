(function() {
  'use strict';

  angular
    .module('app')
    .controller('ActivityTrackerCtrl', atc);

  function atc(ActivityTracker, $ionicPlatform) {
    var atc = this;

    $ionicPlatform.ready(function() {
      atc.newLine = function() {
        console.log('AT new line');
        ActivityTracker.log(Date.now());
      };

      atc.debugLog = ActivityTracker.debug;

      atc.reset = ActivityTracker.reset;
    })
  }
})();
