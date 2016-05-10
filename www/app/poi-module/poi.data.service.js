/**
 * Created by Mathias on 09.05.2016.
 */
(function () {
  'use strict';
  angular
    .module('POIModule')
    .factory('POIData', POIData);

  function POIData() {
    var service = {
      getData: getData
    };

    return service;

    ////////////////////

    function getData(poiId) {
      var data;
      switch (poiId) {
        case 1:
          data = {
            value: "Data for POI 1"
          };
          break;
        case 2:
          data = {
            value: "Data for POI 2"
          };
          break;
        default:
          data = null;
      }
      return data;
    }
  }
})();
