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
      getPoints  : getPoints,
      getMarks   : getMarks,
      getBeacons : getBeacons
      //getGeoMarks: getGeoMarks
    };

    return service;

    ////////////////////

    function getPoints() {
      return $http.get('data/flowers_birds_150m.json');
    }

    function getBeacons() {
      return $http.get('data/beacons.json');
    }

    function getMarks() {
      return [{
        properties: {
          id_poi     : 1111,
          theme_name : "default",
          common_name: "HEIG-VD, Cheseaux"
        },
        geometry  : {
          coordinates: [6.659508, 46.77917, 449]
        }
      }, {
        properties: {
          id_poi     : 2222,
          theme_name : "default",
          common_name: "HEIG-VD, Y-Parc"
        },
        geometry  : {
          coordinates: [6.646264, 46.765427, 436]
        }
      }, {
        properties: {
          id_poi     : 3333,
          theme_name : "default",
          common_name: "HEIG-VD, St-Roch"
        },
        geometry  : {
          coordinates: [6.647128, 46.781001, 431]
        }
      }]
    }

    //function getGeoMarks() {
    //  var points = getMarks(), geo = [];
    //  points.forEach(function (point) {
    //    geo.push(turf.point(point.geometry.coordinates, point.properties));
    //  });
    //  return turf.featureCollection(geo);
    //}
  }
})();
