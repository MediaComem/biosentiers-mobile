/**
 * Created by Mathias on 04.05.2016.
 */
(function () {
  'use strict';

  angular
    .module('poi')
    .factory('PoiGeo', PoiGeoService);

  function PoiGeoService($http) {

    var service = {
      getPath  : getPath,
      getPoints: getPoints
    };

    return service;

    ////////////////////

    function getPoints() {
      return $http.get('data/flowers_birds_150m.json');
    }

    function getPath() {
      return $http.get('data/path.json');
    }
  }
})();
