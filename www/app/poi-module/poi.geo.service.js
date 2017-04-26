/**
 * Created by Mathias on 04.05.2016.
 */
(function() {
  'use strict';

  angular
    .module('poi-module')
    .factory('PoiGeo', PoiGeoService);

  function PoiGeoService($http, $log, themesFilter) {

    var service = {
      getPath          : getPath,
      getPoints        : getPoints,
      getFilteredPoints: getFilteredPoints
    };

    return service;

    ////////////////////

    function getPoints() {
      // return $http.get('data/flowers_birds_150m.json');
      return $http.get('data/flore.json')
    }

    function getPath() {
      return $http.get('data/path.json').then(function(res) {
        return res.data;
      });
    }

    function getFilteredPoints(zones, themes) {
      themes = convertThemes(themes);
      $log.log(themes);
      return getPoints()
        .then(filterPoints);

      ////////////////////

      function filterPoints(res) {
        $log.log('Total number of points', res.data.features.length);
        var pois = _.filter(res.data.features, matchesFilter);
        $log.log(pois.length + ' filtered points base on', zones, themes);
        return pois;
      }

      function matchesFilter(point) {
        return _.includes(zones, point.properties.id_zone) && _.includes(themes, point.properties.theme_name);
      }
    }

    // TODO : fonction temporaire en attendant que le GeoJSON contienne les bonnes valeurs pour theme_name
    function convertThemes(themes) {
      return _.map(themes, function(type) {
        return themesFilter(type);
      })
    }
  }
})();
