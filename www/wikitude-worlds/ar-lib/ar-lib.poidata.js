(function () {
  'use strict';

  angular
    .module('ARLib')
    .factory('POIData', POIDataService);

  function POIDataService($log, $rootScope) {

    var service = {
      data     : null,
      hasData  : hasData,
      setData  : setData,
      getPois  : getPois,
      getThemes: getThemes
    };

    return service;

    ////////////////////

    function hasData() {
      return !!service.data;
    }

    function setData(data) {
      service.data = data;

      if (data) {
        $log.debug('POI data changed');
        $rootScope.$emit('poiData:changed');
      }
    }

    function getPois() {
      return service.data ? service.data.features : [];
    }

    function getThemes() {
      return service.data ? _.compact(_.uniq(_.map(service.data.features, 'properties.theme_name'))).sort() : [];
    }
  }
})();
