(function () {
  'use strict';

  angular
    .module('app')
    .run(run);

  function run($ionicPlatform, Ionicitude, $cordovaToast, POIGeo) {
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
        .addAction(fixUserAltitude)
        .addAction(loadMarkers)
        .listLibActions();

      ////////////////////

      function close(service) {
        console.log('closing');
        service.close();
      }

      function showPos(service, param) {
        console.log('showing position', param);
        $cordovaToast.showLongCenter('lat : ' + param.lat + ", lon : " + param.lon + ", alt :" + param.alt);
      }

      function fixUserAltitude(service, param) {
        if (param.alt < 0) param.alt = 0;
        service.setLocation(param.lat, param.lon, param.alt, param.acc);
      }

      function loadMarkers(service) {
        var pois = POIGeo.getPoints();
        pois.forEach(function (poi) {
          service.callJavaScript('World.createMarker(' + angular.toJson(poi) + ')');
        });
      }

    });
  }
})();
