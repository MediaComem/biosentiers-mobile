/**
 * Created by Mathias on 08.06.2016.
 */
(function () {
  'use strict';
  angular
    .module('app')
    .controller('IdleController', IdleController);

  function IdleController(PoiGeo) {
    console.log(PoiGeo.getGeoMarks());
  }
})();
