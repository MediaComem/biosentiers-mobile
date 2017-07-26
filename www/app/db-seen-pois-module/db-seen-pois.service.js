/**
 * Created by Mathias Oberson on 16.12.2016.
 */
(function() {
  'use strict';
  angular
    .module('db-seen-pois-module')
    .factory('DbSeenPois', DbSeenPoisService);

  function DbSeenPoisService(DbBio, $log, $q, rx) {

    var collName       = 'seen-pois',
        seenPoiSubject = new rx.ReplaySubject(1),
        service        = {
          getAll      : getAll,
          countFor    : countFor,
          addOne      : addOne,
          removeAllFor: removeAllFor,
          seenPoiObs  : seenPoiSubject.asObservable()
        };

    return service;

    ////////////////////

    /**
     * Tries to get all the POIs that have been seen for a particuler excursion.
     * @param appId The app_id of the Excursion for which we want to get all the seen POIs.
     * @return {Promise} A promise of an Array containing the POIs that have been seen for the specified Excursion
     */
    function getAll(appId) {
      return DbBio.getCollection(collName)
        .then(function(coll) {
          var res = coll.find({app_id: appId});
          console.log('DbSeenPois:getAll:result', res);
          return res;
        })
        .catch(handleError);
    }

    /**
     * Counts the number of Seen Poi for the excursion whose ID matches the one received in argument.
     * @param appId
     */
    function countFor(appId) {
      return DbBio.getCollection(collName)
        .then(function(coll) { return coll.count({app_id: appId}); })
        .catch(handleError);
    }

    /**
     * Adds a new seen poi to the collection, that matches the given parameter.
     * @param appId The app_id of the excursion
     * @param serverId The server_id of the excursion in which the poi has been seen
     * @param participantId The id of the excursion's participan
     * @param poiId The ID of the POI that have been seen.
     * @param poiData The GeoJSON object of the seen POI.
     */
    function addOne(appId, serverId, participantId, poiId, poiData) {
      return DbBio.getCollection(collName)
        .then(function(coll) {
          var res = coll.insertOne(new Seen(appId, serverId, participantId, poiId, poiData));
          if ('undefined' === typeof res) throw new Error("DbSeenPois:addOne: An error occured while trying to save that the POI n°" + poiId + " had been seen in the excursion n°" + appId);
          return countFor(appId);
        })
        .then(function(count) {
          seenPoiSubject.onNext({appId: appId, nbSeen: count});
        })
        .then(DbBio.save)
        .catch(handleError);
    }

    /**
     * Remove all the SeenPoi from the database whose server_id matches the given excursionId parameter.
     * @param appId
     */
    function removeAllFor(appId) {
      return DbBio.getCollection(collName)
        .then(function(coll) {
          $log.debug('DbSeenPois:removeAllFor:collection before removing:', appId, angular.copy(coll));
          var res = coll.removeWhere({app_id: appId});
          $log.debug('DbSeenPois:removeAllFor:collection after removing:', angular.copy(coll));
          return res;
        })
        .catch(handleError);
    }

    // TODO : supprimer en prod
    function populate(coll, excursionId) {
      var poiData = {
        geometry  : {
          coordinates: [
            6.64853712883608,
            46.7817862925931,
            431.8
          ],
          type       : "Point"
        },
        properties: {
          common_name : {
            de: "Thunbergs Berberitze",
            fr: "Epine-vinette de Thunberg",
            it: "Crespino di Thunberg",
            la: "Berberis thunbergii"
          },
          created_at  : "20170402112523",
          id_poi      : 166,
          id_specie   : 122,
          id_zone     : 1,
          owner_name  : "Alain Jotterand",
          period_end  : 5,
          period_start: 5,
          theme_name  : "tree"
        },
        type      : "Feature"
      };
      coll.insert([
        new Seen(excursionId, 5007, poiData),
        new Seen(excursionId, 5010, poiData),
        new Seen(excursionId, 5291, poiData),
        new Seen(excursionId, 5391, poiData),
        new Seen(excursionId, 5018, poiData),
        new Seen(excursionId, 5347, poiData)
      ]);
      DbBio.save();
    }

    /**
     * Creates a new Seen object, that represents a POI seen in an Excursion
     * The seenAt property of this object will be set as Date.now().
     * @param appId The app_id of the Excursion in which the POI has been seen
     * @param serverId The server_id of the Excursion in which the POI has been seen
     * @param participantId The id of the participant to the Excursion that has seen the POI
     * @param poiId The id of the POI that has been seen
     * @param poiData The GeoJSON data of the seen POI
     * @constructor
     */
    function Seen(appId, serverId, participantId, poiId, poiData) {
      this.app_id = appId;
      this.server_id = serverId;
      this.participant_id = participantId;
      this.poi_id = poiId;
      this.poi_data = poiData;
      this.seen_at = Date.now();
    }

    /**
     * Determines how to react to an error when a query is executed.
     * Right now, this does nothing more than logging said error and returning it as a rejected Promise.
     * @param error
     */
    function handleError(error) {
      $log.error(error);
      return $q.reject(error);
    }
  }
})();
