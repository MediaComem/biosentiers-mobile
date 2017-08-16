(function() {
  'use strict';
  angular
    .module('db-bio-module')
    .factory('SeenPoi', SeenPoiFn);

  function SeenPoiFn() {
    /**
     * Creates a new SeenPoi object, that represents a POI seen in an Excursion
     * The seenAt property of this object will be set as Date.now().
     * @param {String} qrId - The qrId of the Excursion in which the POI has been seen
     * @param {String} serverId - The serverId of the Excursion in which the POI has been seen
     * @param {String} participantId - The id of the participant to the Excursion that has seen the POI
     * @param {String} poiId - The id of the POI that has been seen
     * @param {GeoJSON} poiData - The GeoJSON data of the seen POI
     * @constructor
     */
    function SeenPoi(qrId, serverId, participantId, poiId, poiData) {
      this.qrId = qrId;
      this.serverId = serverId;
      this.participantId = participantId;
      this.poiId = poiId;
      this.poiData = poiData;
      this.seenAt = new Date();
    }

    return SeenPoi;
  }
})();
