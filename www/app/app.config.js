(function () {
  'use strict';

  angular
    .module('app')
    .run(run);

  function run($ionicPlatform, Ionicitude, $cordovaToast) {
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

      Ionicitude
        .init()
        .addAction(close)
        .addAction(showPos)
        .listLibActions();

      ////////////////////

      function close(service) {
        console.log('closing');
        service.close();
      }

      function showPos(service, param) {
        console.log('showing position', param.lat, param.lon);
        $cordovaToast.showLongBottom('lat : ' + param.lat + ", lon : " + param.lon);
      }
    });
  }
})();
