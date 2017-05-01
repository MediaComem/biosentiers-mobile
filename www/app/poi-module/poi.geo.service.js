/**
 * Created by Mathias on 04.05.2016.
 */
(function() {
  'use strict';

  angular
    .module('poi-module')
    .factory('PoiGeo', PoiGeoService);

  function PoiGeoService($http, $log, themesFilter, $q, turf) {

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
      return $http.get('data/flore.json');
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
      var indexedZones = [], start, end;
      zonesGeoData.features.forEach(function(zoneFeature) {
        indexedZones[zoneFeature.properties.id_zone] = zoneFeature;
      });
      $log.info(indexedZones);
      start = _.find(indexedZones, defined).properties.start;
      end = _.last(indexedZones).properties.end;
      return {
        start: turf.helpers.point([start.lng, start.lat, start.alt], start),
        end  : turf.helpers.point([end.lng, end.lat, end.alt], end)
      };

      function defined(element) {
        return !!element;
      }
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
})
();
