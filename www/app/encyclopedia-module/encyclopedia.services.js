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
          var groupedbyTheme = _.groupBy(success.data.features, function(d){return d.properties.theme});
          return _.groupBy(_.sortBy(groupedbyTheme[theme],"properties.commonName"), function(d){return d.properties.commonName});
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
        return _.filter(encyclopedia, function(species){ return species.properties.speciesId === speciesId; });
      });
    }
  }
})();
