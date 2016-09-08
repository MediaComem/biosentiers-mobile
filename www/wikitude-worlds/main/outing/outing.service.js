(function () {
  'use strict';

  angular
    .module('outing')
    .factory('Outing', OutingService);

  function OutingService(AppActions, $log, rx) {

    var outing,
        currentPoi,
        currentPoiDetails,
        outingSubject = new rx.ReplaySubject(1),
        currentPoiSubject = new rx.ReplaySubject(1);

    var service = {
      // Outing functions
      hasOuting     : hasOuting,
      setOuting     : setOuting,
      getPois       : getPois,
      getPathGeoJson: getPathGeoJson,
      getThemes     : getThemes,
      // Current POI functions
      loadCurrentPoi: loadCurrentPoi,
      // Observables
      outingChangeObs    : outingSubject.asObservable(),
      currentPoiChangeObs: currentPoiSubject.asObservable()
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

    function loadCurrentPoi(poi) {
      AppActions.execute('loadPoiDetails', { id: poi.properties.id_poi }).then(function(details) {

        currentPoi = poi;
        currentPoiDetails = details;

        currentPoiSubject.onNext({
          poi: currentPoi,
          details: currentPoiDetails
        });
      });
    }
  }
})();
