/**
 * Created by Mathias on 29.03.2016.
 */
(function () {
  'use strict';

  angular
    .module('app')
    .controller('OutingCtrl', OutingCtrl);

  function OutingCtrl(Ionicitude) {
    var outing = this;

    outing.launchAR = function () {
      Ionicitude.launchAR().then(function (success) {
        console.log('World loaded', success);
        Ionicitude.callJavaScript('World.talk("Je peux faire quelque chose depuis Ionic !")');
      }).catch(function (error) {
        console.log('World not loaded', error);
      });
    }
  }
})();
