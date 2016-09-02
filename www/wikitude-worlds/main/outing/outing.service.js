(function () {
  'use strict';

  angular
    .module('outing')
    .factory('Outing', OutingService);

  function OutingService($log, $rootScope, rx) {

    var outing,
        outingSubject = new rx.ReplaySubject(1);

    var service = {
      hasOuting      : hasOuting,
      setOuting      : setOuting,
      getPois        : getPois,
      getPathGeoJson : getPathGeoJson,
      getThemes      : getThemes,
      outingChangeObs: outingSubject.asObservable()
    };

    return service;

    ////////////////////

    function hasOuting() {
      return !_.isNil(outing);
    }

    function setOuting(newOuting) {
      if (newOuting) {
        outing = newOuting;
        $log.debug('Outing loaded');
        outingSubject.onNext(outing);
      }
    }

    function getPoisGeoJson() {
      return outing ? outing.pois : undefined;
    }

    function getPois() {
      return outing ? outing.pois.features : undefined;
    }

    function getThemes() {
      return outing ? _.compact(_.uniq(_.map(outing.pois.features, 'properties.theme_name'))).sort() : undefined;
    }

    function getPathGeoJson() {
      return outing ? outing.path : undefined;
    }
  }
})();
