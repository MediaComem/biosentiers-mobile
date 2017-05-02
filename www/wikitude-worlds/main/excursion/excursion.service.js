(function() {
  'use strict';

  angular
    .module('excursion')
    .factory('Excursion', ExcursionService);

  function ExcursionService(AppActions, $log, rx) {

    var excursion,
        currentPoi,
        currentPoiDetails,
        excursionSubject     = new rx.ReplaySubject(1),
        currentPoiSubject = new rx.ReplaySubject(1);

    var service = {
      get id() { return getId() },
      get startPoint() { return getStartPoint() },
      get endpoint() { return getEndPoint() },
      // Excursion functions
      hasExcursion          : hasExcursion,
      setExcursion          : setExcursion,
      getPois            : getPois,
      getPathGeoJson     : getPathGeoJson,
      getStartPoint      : getStartPoint,
      getEndPoint        : getEndPoint,
      getThemes          : getThemes,
      getSeenPois        : getSeenPois,
      // Current POI functions
      loadCurrentPoi     : loadCurrentPoi,
      // Observables
      excursionChangeObs    : excursionSubject.asObservable(),
      currentPoiChangeObs: currentPoiSubject.asObservable()
    };

    return service;

    ////////////////////

    function getId() {
      return hasExcursion() ? excursion.id : undefined;
    }

    function hasExcursion() {
      return !_.isNil(excursion);
    }

    function setExcursion(newExcursion) {
      if (newExcursion) {
        excursion = newExcursion;
        $log.debug('Excursion loaded', excursion);
        excursionSubject.onNext(excursion);
      }
    }

    function getPois() {
      return hasExcursion() ? excursion.pois : undefined;
    }

    function getThemes() {
      return hasExcursion() ? excursion.themes : undefined;
    }

    function getSeenPois() {
      return hasExcursion() ? excursion.seen : undefined;
    }

    function getPathGeoJson() {
      return hasExcursion() ? excursion.path : undefined;
    }

    function getStartPoint() {
      // TODO : Lookup for the start point as the start point of the first selected zone
      return hasExcursion() ? excursion.extremityPoints.start : undefined;
    }

    function getEndPoint() {
      // TODO : Lookup for the end point as the end point of the last selected zone
      return hasExcursion() ? excursion.extremityPoints.end : undefined;
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
