(function () {
  'use strict';
  angular
    .module('encyclopedia-module')
    .factory('Species', EncyclopediaFn);

  function EncyclopediaFn(PoiGeo, $log) {

    var service = {
      getAll: getAll,
      getOne: getOne
    };

    return service;

    ////////////////////

    function getAll(theme) {

      return PoiGeo.getPoints().then(function(success) {
        if(theme){
          var groupedbyTheme = _.groupBy(success.data.features, function(d){return d.properties.theme_name});
          return _.groupBy(_.sortBy(groupedbyTheme[theme],"properties.common_name"), function(d){return d.properties.common_name});
        }
        else{
          return success.data.features;
        }

      }, function(error) {
        $log.warn(error);
      });
    }

    function getOne(speciesId) {
      return getAll().then(function(encyclopedia) {
        return _.filter(encyclopedia, function(species){ return species.properties.id_specie === speciesId; });
      });
    }
  }
})();
