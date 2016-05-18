/**
 * Created by Mathias on 04.05.2016.
 */
(function () {
  'use strict';
  angular
    .module('POIModule')
    .factory('POIGeo', POIGeo);

  function POIGeo($http) {
    var service = {
      getPoints: getPoints,
      getMarks: getMarks
    };

    return service;

    ////////////////////

    function getPoints() {
      return $http.get('data/geodata.json');
    }

    function getMarks() {
      return [{
        properties: {
          id_poi: "HEIG-VD, Cheseaux",
          theme_name: "default"
        },
        geometry: {
          coordinates: [6.659508, 46.77917, 449]
        }
      }, {
        properties: {
          id_poi: "HEIG-VD, Y-Parc",
          theme_name: "default"
        },
        geometry: {
          coordinates: [6.646264, 46.765427, 436]
        }
      }, {
        properties: {
          id_poi: "HEIG-VD, St-Roch",
          theme_name: "default"
        },
        geometry: {
          coordinates: [6.647128, 46.781001, 431]
        }
      }]
    }
  }
})();
