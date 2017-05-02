/**
 * Created by Mathias Oberson on 16.12.2016.
 */
(function() {
  'use strict';
  angular
    .module('seen-pois-data-module')
    .factory('SeenPoisData', SeenPoisDataService);

  function SeenPoisDataService(BioDb, $log, Loki, $q) {

    var deferred = $q.defer();
    var db,
        collName = 'seen-pois',
        service  = {
          getAll  : getAll,
          countFor: countFor,
          addOne  : addOne
        };

    return service;

    ////////////////////

    /**
     * Tries to get all the POIs that have been seen for a particuler excursion.
     * @param excursionId The ID of the Excursion for which we want to get all the seen POIs.
     * @return {Promise} A promise of an Array containing the POIs that have been seen for the specified Excursion
     */
    function getAll(excursionId) {
      return BioDb.getCollection(collName)
        .then(function(coll) {
          var res = coll.find({excursion_id: excursionId});
          if (res.length === 0) {
            populate(coll, excursionId);
            res = coll.find({excursion_id: excursionId});
          }
          return res;
        })
        .catch(handleError);
    }

    function countFor(excursionId) {
      $log.log('countFor id', excursionId);
      return BioDb.getCollection(collName)
        .then(function(coll) {
          $log.log('coutnFor collection', coll);
          return coll.count({excursion_id: excursionId});
        }).catch(handleError);
    }

    /**
     * Adds a new seen poi to the collection, that matches the given parameter.
     * @param excursionId The ID of the excursion in which the poi has been seen
     * @param poiId The ID of the POI that have been seen.
     */
    function addOne(excursionId, poiId) {
      return BioDb.getCollection(collName)
        .then(function(coll) {
          return coll.insertOne(new SeenClass(excursionId, poiId));
        })
        .then(BioDb.save)
        .catch(handleError);
    }

    // TODO : supprimer en prod
    function populate(coll, excursionId) {
      coll.insert([
        new SeenClass(excursionId, 5007),
        new SeenClass(excursionId, 5010),
        new SeenClass(excursionId, 5291),
        new SeenClass(excursionId, 5391),
        new SeenClass(excursionId, 5018),
        new SeenClass(excursionId, 5347)
      ]);
      BioDb.save();
    }

    /**
     * Creates a new SeenClass with the given id.
     * The seenAt property of this object will be set as Date.now().
     * @param excursionId The id of the Excursion in which the SeenClass must be added
     * @param poiId The id of the new SeenClass
     * @constructor
     */
    function SeenClass(excursionId, poiId) {
      this.excursion_id = excursionId;
      this.poi_id = poiId;
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