(function () {
  'use strict';
  angular
    .module('SpeciesModule')
    .factory('Species', Species);

  function Species(PoiGeo) {

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

    function getOne(specieId) {
      return getAll().then(function(species) {
        return _.filter(species, function(d){ return d.properties.id_specie == specieId; });
      });

      return null;
    }

  }
})();
