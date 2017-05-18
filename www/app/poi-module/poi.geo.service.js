/**
 * Created by Mathias on 04.05.2016.
 */
(function() {
  'use strict';

  angular
    .module('poi-module')
    .factory('PoiGeo', PoiGeoService);

  function PoiGeoService($http, $log, themesFilter, $q, turf) {
    var dataPath = "data/partial/";

    var service = {
      getPath            : getPath,
      getZones           : getZones,
      getPoints          : getPoints,
      getFilteredPoints  : getFilteredPoints,
      getExcursionGeoData: getExcursionGeoData
    };

    return service;

    ////////////////////

    /**
     * Get all GeoJSON data for an Excursion
     * @param zones An Array of zone numbers
     */
    function getExcursionGeoData(zones) {
      var promises = [
            getPath(),
            getZones(zones),
          ],
          data     = {};
      return $q.all(promises).then(function(results) {
        data.path = results[0];
        data.zones = results[1];
        data.extremityPoints = getExtremityPoints(data.zones);
        return data;
      });
    }

    function getPoints() {
      // return $http.get('data/flowers_birds_150m.json');
      var data = [
        $http.get(dataPath + 'flower_all.json'),
        $http.get(dataPath + 'tree_all.json'),
        $http.get(dataPath + 'bird.json'),
        $http.get(dataPath + 'butterfly.json')
      ];

      return $q.all(data).then(function(result) {
        $log.log('PoiGeo:getPoints:promise results', result);
        var features = [];
        for (var i = 0; i < result.length; i++) {
          features = _.concat(features, result[i].data.features);
        }
        var res = turf.helpers.featureCollection(features);
        $log.log('PoiGeo:getPoints:return result', res);
        return res;
      })
    }

    function getPath() {
      return $http.get('data/path.json').then(function(res) {
        return res.data;
      });
    }

    function getZones(zones) {
      return $http.get('data/zones.json').then(function(res) {
        res.data.features = _.filter(res.data.features, matchesSelectedZones);
        return res.data;
      });

      function matchesSelectedZones(zone) {
        return _.includes(zones, zone.properties.id_zone);
      }
    }

    function getExtremityPoints(zonesGeoData) {
      $log.log('PoiGeo:getExtremityPoints', zonesGeoData);
      var indexedZones = [], start, end;
      zonesGeoData.features.forEach(function(zoneFeature) {
        indexedZones[zoneFeature.properties.id_zone] = zoneFeature;
      });
      $log.info('PoiGeo:indexedZones', indexedZones);
      start = _.find(indexedZones, defined).properties.start;
      end = _.last(indexedZones).properties.end;
      $log.log('PoiGeo:extremityPoints', start, end);
      return {
        start: start,
        end  : end
      };

      function defined(element) {
        return !!element;
      }
    }

    function getFilteredPoints(zones, themes) {
      return getPoints()
        .then(filterPoints);

      ////////////////////

      function filterPoints(res) {
        $log.log('PoiGeo:getFilteredPoints:Total number of points', res.features.length);
        var pois = _.filter(res.features, matchesFilter);
        $log.log('PoiGeo:getFilteredPoints:' + pois.length + ' filtered points base on', zones, themes);
        return pois;
      }

      function matchesFilter(point) {
        return _.includes(zones, point.properties.id_zone) && _.includes(themes, point.properties.theme_name);
      }
    }
  }
})
();
