/**
 * Created by Mathias on 04.05.2016.
 */
(function () {
  'use strict';
  angular
    .module('POIModule')
    .factory('POIGeo', POIGeo);

  function POIGeo() {
    var service = {
      getPoints: getPoints
    };

    return service;

    ////////////////////

    function getPoints() {
      return [{
        lat: 46.77917,
        lon: 6.659508,
        alt: 449,
        name: 'HEIG-VD, Cheseaux',
        type: 'building',
        id: 1
      }, {
        lat: 46.765427,
        lon: 6.646264,
        alt: 436,
        name: 'HEIG-VD, Y-Parc',
        type: 'building',
        id: 2
      }]
    }
  }
})();
