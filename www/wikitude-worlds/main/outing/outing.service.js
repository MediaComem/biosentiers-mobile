(function() {
  'use strict';

  angular
    .module('outing')
    .factory('Outing', OutingService);

  function OutingService(AppActions, $log, rx) {

    var outing,
        currentPoi,
        currentPoiDetails,
        outingSubject     = new rx.ReplaySubject(1),
        currentPoiSubject = new rx.ReplaySubject(1);

    var service = {
      get id() {
        return hasOuting() ? outing.id : undefined;
      },
      // Outing functions
      hasOuting          : hasOuting,
      setOuting          : setOuting,
      getPois            : getPois,
      getPathGeoJson     : getPathGeoJson,
      getStartPoint      : getStartPoint,
      getEndPoint        : getEndPoint,
      getThemes          : getThemes,
      getSeenPois        : getSeenPois,
      // Current POI functions
      loadCurrentPoi     : loadCurrentPoi,
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
        $log.debug('Outing loaded', outing);
        outingSubject.onNext(outing);
      }
    }

    function getPois() {
      return outing ? outing.pois : undefined;
    }

    function getThemes() {
      // return outing ? _.compact(_.uniq(_.map(outing.pois.features, 'properties.theme_name'))).sort() : undefined;
      return outing ? outing.themes : undefined;
    }

    function getSeenPois() {
      return outing ? outing.seen : undefined;
    }

    function getPathGeoJson() {
      return outing ? outing.path : undefined;
    }

    function getStartPoint() {
      // TODO : Lookup for the start point as the start point of the first selected zone
      return outing ? outing.path.features[1] : undefined;
    }

    function getEndPoint() {
      // TODO : Lookup for the end point as the end point of the last selected zone
      return outing ? outing.path.features[2] : undefined;
    }

    function loadCurrentPoi(poi) {

      var params  = {id: poi.properties.id_poi},
          options = {return: true};

      AppActions.execute('loadPoiDetails', params, options).then(function(details) {

        currentPoi = poi;
        currentPoiDetails = details;

        currentPoiSubject.onNext({
          poi    : currentPoi,
          details: currentPoiDetails
        });
      });
    }
  }
})();
