/**
 * Created by Mathias on 09.05.2016.
 */
(function () {
  'use strict';

  angular
    .module('poi')
    .factory('PoiContent', PoiContentService);

  function PoiContentService() {

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
            lat: 46.77917,
            lon: 6.659508,
            alt: 449,
            name: 'HEIG-VD, Cheseaux',
            type: 'building',
            id: 1
          };
          break;
        case 2:
          data = {
            lat: 46.765427,
            lon: 6.646264,
            alt: 436,
            name: 'HEIG-VD, Y-Parc',
            type: 'building',
            id: 2
          };
          break;
        default:
          data = null;
      }
      return data;
    }
  }
})();
