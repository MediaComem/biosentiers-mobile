/**
 * Created by Mathias on 29.03.2016.
 */
(function () {
  'use strict';

  angular
    .module('app')
    .controller('OutingsCtrl', OutingsCtrl)

  function OutingsCtrl(outingsData) {
    var ctrl = this;
    ctrl.outings = outingsData;
    console.log(ctrl.outings);
  }
})();
