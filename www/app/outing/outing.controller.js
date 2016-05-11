/**
 * Created by Mathias on 29.03.2016.
 */
(function () {
  'use strict';

  angular
    .module('app')
    .controller('OutingCtrl', OutingCtrl);

  function OutingCtrl(Ionicitude, outingData, $scope) {
    var ctrl = this;

    ctrl.launchAR = function () {
      Ionicitude.launchAR().then(function (success) {
        console.log('World loaded', success);
      }).catch(function (error) {
        console.log('World not loaded', error);
      });
    };

    ctrl.data = outingData;
    console.log(ctrl);
    console.log($scope);
  }
})();
