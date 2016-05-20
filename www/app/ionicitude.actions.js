/**
 * Created by Mathias on 17.05.2016.
 */
(function () {
  'use strict';

  angular
    .module('app')
    .run(ionicitude);

  function ionicitude($ionicPlatform, Ionicitude, $cordovaToast, POIGeo, POIData) {
    $ionicPlatform.ready(function () {
      Ionicitude
        .init()
        .addAction(close)
        .addAction(showPos)
        .addAction(loadMarkers)
        .addAction(loadMarkerData)
        .addAction(toast)
        .addAction(setPosition)
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

      function loadMarkers(service) {
        var marks = POIGeo.getMarks(),
          start = Date.now();
        service.callJavaScript('World.loadPois(' + angular.toJson(marks) + ')');
        //POIGeo.getPoints()
        //  .then(function (success) {
        //    //var pois = (success.data.features).slice(0, 100);
        //    var pois = success.data.features;
        //    console.log(pois);
        //    service.callJavaScript('World.loadPois(' + angular.toJson(pois) + ')');
        //    service.callJavaScript('World.timer(' + start + ')');
        //  })
        //  .catch(function (error) {
        //    console.log(error);
        //  });
      }

      function loadMarkerData(service, param) {
        console.log('get marker data');
        service.callJavaScript('World.loadPoiData(' + angular.toJson(POIData.getData(param.id)) + ')');
      }

      function toast(service, param) {
        $cordovaToast.showLongCenter(param.message);
      }

      function setPosition(service, param) {
        console.log('setting position :', param);
        service.setLocation(param.lat, param.lon, param.alt, 1);
      }
    });
  }
})();
