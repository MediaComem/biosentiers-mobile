(function () {
  'use strict';

  angular
    .module('app')
    .run(run);

  function run($ionicPlatform, Wikitude) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      Wikitude.init();
      Wikitude.executeARViewCall('architectsdk://function1?{"hello":"world"}');
    });
  }
})();
