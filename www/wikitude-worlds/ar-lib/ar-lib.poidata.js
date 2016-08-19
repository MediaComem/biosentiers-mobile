(function () {
  'use strict';

  angular
    .module('ARLib')
    .factory('POIData', POIDataService);

  function POIDataService($rootScope) {

    var service = {
      data: null,

      hasData: function() {
        return !!service.data;
      },

      setData: function(data) {
        service.data = data;

        if (data) {
          $rootScope.$emit('poiData:changed');
        }
      },

      getPois: function() {
        return service.data ? service.data.features : [];
      },

      getThemes: function() {
        return service.data ? _.compact(_.uniq(_.map(service.data.features, 'properties.theme_name'))).sort() : [];
      }
    };

    return service;
  }
})();
