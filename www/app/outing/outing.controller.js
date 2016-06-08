/**
 * Created by Mathias on 29.03.2016.
 */
(function () {
  'use strict';

  angular
    .module('app')
    .controller('OutingCtrl', OutingCtrl);

  function OutingCtrl(Ionicitude, outingData, $cordovaToast, POIGeo) {
    var ctrl = this;

    ctrl.launchAR = function () {
      try {
        Ionicitude.launchAR()
          .then(POIGeo.getPoints)
          .then(worldLoaded)
          .catch(handleError);
      } catch (e) {
        console.log(e);
        $cordovaToast.showShortBottom("Device not supported !");
      }
    };

    ctrl.data = outingData;

    function handleError(error) {
      console.log('World not loaded', error);
    }

    function worldLoaded(success) {
      console.log('World loaded', success);
      Ionicitude.callJavaScript('World.loadPoints(' + angular.toJson(success.data) + ')');
    }
  }
})();
