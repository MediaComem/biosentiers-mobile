/**
 * Created by Mathias on 29.03.2016.
 */
(function () {
  'use strict';

  angular
    .module('app')
    .controller('OutingCtrl', OutingCtrl);

  function OutingCtrl(Wikitude) {
    var outing = this;

    outing.launchAR = Wikitude.result;
  }
})();
