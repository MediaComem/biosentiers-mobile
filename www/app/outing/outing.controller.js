/**
 * Created by Mathias on 29.03.2016.
 */
(function () {
  'use strict';

  angular
    .module('app')
    .controller('OutingCtrl', OutingCtrl);

  function OutingCtrl(Ionicitude, outingData, $cordovaToast) {
    var ctrl = this;

    ctrl.launchAR = function () {
      try {
        Ionicitude.launchAR().then(function (success) {
          console.log('World loaded', success);
        }).catch(function (error) {
          console.log('World not loaded', error);
        });
      } catch(e) {
        console.log(e);
        $cordovaToast.showShortBottom("Device not supported !");
      }
    };

    ctrl.data = outingData;
  }
})();
