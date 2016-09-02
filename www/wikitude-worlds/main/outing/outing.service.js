(function () {
  'use strict';

  angular
    .module('outing')
    .factory('Outing', OutingService);

  function OutingService($log, $rootScope, rx) {

    var dataSubject = new rx.BehaviorSubject({
      pois: [],
      themes: []
    });

    var service = {
      hasData      : hasData,
      setData      : setData,
      getPois      : getPois,
      getThemes    : getThemes,
      dataChangeObs: dataSubject.asObservable()
    };

    return service;

    ////////////////////

    function hasData() {
      return getPois().length >= 1;
    }

    function setData(data) {
      if (data) {
        $log.debug('POI data changed');
        dataSubject.onNext({
          pois: data.features,
          themes: _.compact(_.uniq(_.map(data.features, 'properties.theme_name'))).sort()
        });
      }
    }

    function getPois() {
      return dataSubject.getValue().pois;
    }

    function getThemes() {
      return dataSubject.getValue().themes;
    }
  }
})();
