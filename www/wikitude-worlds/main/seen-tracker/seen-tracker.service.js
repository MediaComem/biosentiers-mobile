/**
 * Created by Mathias Oberson on 16.12.2016.
 */
(function() {
  'use strict';
  angular
    .module('seen-tracker')
    .factory('SeenTracker', SeenTrackerService);

  function SeenTrackerService($log, Outing) {
    var seenPois = [],
        service  = {
          getSeenPois: getSeenPois,
          setSeen: setSeen,
          hasBeenSeen: hasBeenSeen
        };

    Outing.outingChangeObs.subscribe(setSeenPois);

    return service;

    ////////////////////

    /**
     * Get the IDs of the pois that have already been seen by the user.
     * These IDs are stored on the Ionic side of the app, so this function executes an AppAction to retrieve them.
     * When the IDs are returned, they're stored in the 'seenPois' variable.
     */
    function getSeenPois() {
      return angular.copy(seenPois);
    }

    function setSeen(poiId) {

    }

    function setSeenPois() {
      seenPois = Outing.getSeenPois();
      $log.log('seenPois from SeenTracker', seenPois);
    }

    /**
     * Check if the given POI has not already been seen by the user.
     * @param poi A GeoJSON object representing the POI to check. Must contains a properties.id property
     * @return {boolean} True if the POI remains to be seen, False if the POI has already been seen.
     */
    function hasBeenSeen(poi) {
      return !_.includes(seenPois, poi.properties.id_poi);
    }
  }
})();