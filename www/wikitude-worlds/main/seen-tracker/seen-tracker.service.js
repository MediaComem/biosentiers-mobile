/**
 * Created by Mathias Oberson on 16.12.2016.
 */
(function() {
  'use strict';
  angular
    .module('seen-tracker')
    .factory('SeenTracker', SeenTrackerService);

  function SeenTrackerService($log, Excursion, AppActions) {
    var seenPois = [],
        service  = {
          getSeenPois: getSeenPois,
          addSeenId  : addSeenId,
          hasBeenSeen: hasBeenSeen
        };

    Excursion.excursionChangeObs.subscribe(setSeenPois);

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

    /**
     * Set that the POI with the ID passed as argument has been seen by the user.
     * @param poiId The ID of the POI to mark as seen.
     */
    function addSeenId(poiId) {
      if (!_.includes(seenPois, poiId)) {
        seenPois.push(poiId);
        $log.log(seenPois);
        var param = {
          poiId: poiId,
          excursionId: Excursion.id
        };
        AppActions.execute('addSeenPoi', param);
      }
    }

    /**
     * Set the value for the private seenPois Array.
     */
    function setSeenPois() {
      seenPois = Excursion.getSeenPois();
      $log.log('seenPois from SeenTracker', seenPois);
    }

    /**
     * Check if the given POI has not already been seen by the user.
     * @param poi A GeoJSON object representing the POI to check. Must contains a properties.id property
     * @return {boolean} True if the POI has been seen, False if the POI remains to be seen.
     */
    function hasBeenSeen(poi) {
      var seen = !!_.find(seenPois, {poi_id: poi.properties.id_poi});
      $log.log('SeenTracker:hasBeenSeen', poi, seenPois, seen);
      return seen;
    }
  }
})();
