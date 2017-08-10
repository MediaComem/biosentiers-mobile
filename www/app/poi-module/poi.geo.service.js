/**
 * Created by Mathias on 04.05.2016.
 */
(function() {
  'use strict';

  angular
    .module('poi-module')
    .factory('PoiGeo', PoiGeoService);

  function PoiGeoService($http, $log, $q, turf) {
    var TAG      = "[PoiGeo] ",
        dataPath = "data/complete/",
        service  = {
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
      var promises = {
            path : getPath(),
            zones: getZones(zones),
          },
          data     = {};
      return $q.all(promises).then(function(results) {
        data.path = results.path;
        data.zones = results.zones;
        data.extremityPoints = getExtremityPoints(data.zones);
        return data;
      });
    }

    function getPoints() {
      // return $http.get('data/flowers_birds_150m.json');
      var data = [
        $http.get(dataPath + 'flower.json'),
        $http.get(dataPath + 'tree.json'),
        $http.get(dataPath + 'bird.json'),
        $http.get(dataPath + 'butterfly.json')
      ];

      return $q.all(data).then(function(result) {
        $log.log(TAG + 'getPoints:promise results', result);
        var features = [];
        for (var i = 0; i < result.length; i++) {
          features = _.concat(features, result[i].data.features);
        }
        var res = turf.helpers.featureCollection(features);
        $log.log(TAG + 'getPoints:return result', res);
        return res;
      })
    }

    function getPath() {
      return $http.get('data/path.json').then(function(res) {
        return res.data;
      });
    }

    /**
     * Fetch the GeoJSON object of the requested zones.
     * The GeoJSON objects being stored in an orderded manner in the json file,
     * the zones parameter must be an array of indexes, indicating which zones should be returned.
     * The returned array will contains only the requested GeoJSON zone objects.
     * @param {Array} zones An integer array of indexes
     */
    function getZones(zones) {
      return $http.get('data/zones.json').then(function(res) {
        // res.data.features = _.pullAt(res.data.features, zones);
        return _.pullAt(res.data.features, zones);
      });

      // function matchesSelectedZones(zone) {
      //   return _.includes(zones, zone.properties.id_zone);
      // }
    }

    /**
     * Fetch the UUID of the requested zones.
     * This function relies on the getZones function.
     * Thus the zones argument must also be an array of indexes.
     * @param zones
     */
    function getZonesId(zones) {
      return getZones(zones)
        .then(function(res) {
          return res.map(function(zone) {
            return zone.properties.id;
          })
        })
    }

    function getExtremityPoints(zonesGeoData) {
      return {
        start: _.first(zonesGeoData).properties.points.start,
        end  : _.last(zonesGeoData).properties.points.end
      };
      // $log.log(TAG + 'getExtremityPoints', zonesGeoData);
      // var indexedZones = [], start, end;
      // zonesGeoData.features.forEach(function(zoneFeature) {
      //   indexedZones[zoneFeature.properties.id_zone] = zoneFeature;
      // });
      // $log.info(TAG + 'indexedZones', indexedZones);
      // start = _.find(indexedZones, defined).properties.start;
      // end = _.last(indexedZones).properties.end;
      // $log.log(TAG + 'extremityPoints', start, end);
      // return {
      //   start: start,
      //   end  : end
      // };
      //
      // function defined(element) {
      //   return !!element;
      // }
    }

    function getFilteredPoints(zonesIndexes, themes) {
      return $q.all({
        points: getPoints(),
        zones : getZonesId(zonesIndexes)
      }).then(filterPoints);

      ////////////////////

      function filterPoints(res) {
        $log.log(TAG + 'getFilteredPoints:Total number of points', res.points.features.length);
        var pois = _.filter(res.points.features, matchesFilter);
        $log.log(TAG + 'getFilteredPoints:' + pois.length + ' filtered points based on', res.zones, themes);
        return pois;

        function matchesFilter(point) {
          return _.includes(res.zones, point.properties.zoneId) && _.includes(themes, point.properties.theme);
        }
      }
    }
  }
})
();
