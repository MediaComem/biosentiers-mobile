(function() {
  'use strict';

  angular
    .module('excursion')
    .factory('Excursion', ExcursionService);

  function ExcursionService(AppActions, $log, rx) {

    var excursion,
        currentPoi,
        currentPoiDetails,
        // excursionSubject     = new rx.ReplaySubject(1),
        excursionSubject  = new rx.AsyncSubject(),
        currentPoiSubject = new rx.ReplaySubject(1);

    var service = {
      // Getters
      get qrId() { return getQrId() },
      get serverId() { return getServerId() },
      get participantId() { return getParticipantId() },
      get startPoint() { return getStartPoint(); },
      get endPoint() { return getEndPoint(); },
      get pois() { return getPois() },
      get pathGeoJson() { return getPathGeoJson() },
      get themes() { return getThemes() },
      get seenPois() { return getSeenPois() },
      // Excursion functions
      hasExcursion       : hasExcursion,
      load               : load,
      // Current POI functions
      loadCurrentPoi     : loadCurrentPoi,
      // Observables
      excursionChangeObs : excursionSubject.asObservable(),
      currentPoiChangeObs: currentPoiSubject.asObservable()
    };

    return service;

    ////////////////////

    /**
     * Getter for the Qr Id of the loaded excursion
     * @return {String|undefined}
     */
    function getQrId() {
      return hasExcursion() ? excursion.qrId : undefined;
    }

    /**
     * Getter for the Server Id of the loaded excursion
     * @return {String|undefined}
     */
    function getServerId() {
      return hasExcursion() ? excursion.serverId : undefined;
    }

    /**
     * Getter for the Participant Id of the loaded excursion
     * @return {String|undefined}
     */
    function getParticipantId() {
      return hasExcursion() ? excursion.participantId : undefined;
    }

    /**
     * Getter for all pois of the loaded excursion
     * @return {Array|undefined}
     */
    function getPois() {
      return hasExcursion() ? excursion.pois : undefined;
    }

    /**
     * Getter for all themes of the loaded excursion
     * @return {Array|undefined}
     */
    function getThemes() {
      return hasExcursion() ? excursion.themes : undefined;
    }

    /**
     * Getter for all seen pois of the loaded excursion
     * @return {Array|undefined}
     */
    function getSeenPois() {
      return hasExcursion() ? excursion.seen : undefined;
    }

    /**
     * Getter for the GeoJSON object of the loaded excursion's path
     * @return {Object|undefined}
     */
    function getPathGeoJson() {
      return hasExcursion() ? excursion.path : undefined;
    }

    /**
     * Getter for the starting point of the loaded excursion
     * @return {Object|undefined}
     */
    function getStartPoint() {
      // TODO : Lookup for the start point as the start point of the first selected zone
      return hasExcursion() ? excursion.extremityPoints.start : undefined;
    }

    /**
     * Getter for the ending point of the laoded excursion
     * @return {Object|undefined}
     */
    function getEndPoint() {
      // TODO : Lookup for the end point as the end point of the last selected zone
      return hasExcursion() ? excursion.extremityPoints.end : undefined;
    }

    /**
     * Checks if the excursion has been loaded.
     * @return {boolean}
     */
    function hasExcursion() {
      return !_.isNil(excursion);
    }

    /**
     * Cache the loaded excursion and send it through the listeners, then complete the event.
     * @param newExcursion
     */
    function load(newExcursion) {
      if (newExcursion) {
        excursion = newExcursion;
        $log.debug('Excursion loaded', excursion);
        excursionSubject.onNext(excursion);
        excursionSubject.onCompleted();
      }
    }

    /**
     * Loads the given poi details from the Ionic View
     * @param poi
     */
    function loadCurrentPoi(poi) {

      var params  = {specieId: poi.properties.id_specie, theme: poi.properties.theme_name},
          options = {return: true};

      AppActions.execute('loadPoiDetails', params, options).then(function(details) {
        $log.log('ExcursionService:loadCurrentPoi', details);

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
