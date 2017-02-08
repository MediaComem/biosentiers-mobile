/**
 * Created by Mathias Oberson on 16.12.2016.
 */
(function() {
  'use strict';
  angular
    .module('seen-pois-data')
    .factory('SeenPoisData', SeenPoisDataService);

  function SeenPoisDataService(BioDb, $log, Loki, $q) {

    var deferred = $q.defer();
    var db,
        collName = 'seen-pois',
        service  = {
          getAll: getAll,
          addOne: addOne
        };

    return service;

    ////////////////////

    /**
     * Tries to get all the POIs that have been seen for a particuler outing.
     * If it's the first time retrieving the POIs for this outing, the collection will be created.
     * By passing True as the second parameter, it's possible to retrieve an Array containing the IDs of the POIs that have been seen.
     * By not passing a second parameter or by passing False, the result will be returned as they are in the database
     * @param outingId The ID of the Outing for which we want to get all the seen POIs.
     * @param asIdArray A Boolean indicating if the results should be returned as an array of IDs
     * @return {Promise} A promise of an Array containing the IDs of the POIs that have been seen for the specified Outing
     */
    // function getAll(outingId, asIdArray) {
    //   console.log(outingId, typeof outingId);
    //   if (!outingId || typeof outingId !== "number") {
    //     throw new TypeError('SeenPoisData.getAll expect first parameter to be an Outing Id');
    //   }
    //   return start().then(function() {
    //     var seen = db.getCollection(outingId);
    //     if (!seen) {
    //       $log.log('No seen POIs. Creating the collection');
    //       seen = db.addCollection(outingId);
    //       init(seen);
    //       $log.log(db);
    //       save();
    //     } else {
    //       $log.log('Some POIs seen. Database loaded', seen.data);
    //     }
    //     if (asIdArray === true) {
    //       return _.map(seen.data, 'id');
    //     } else {
    //       return seen.data;
    //     }
    //   });
    // }

    function getAll(outingId) {
      return BioDb.getCollection(collName)
        .then(function(coll) {
          var res = coll.find({outing_id: outingId});
          if (res.length === 0) {
            populate(coll, outingId);
            res = coll.find({outing_id: outingId});
          }
          return res;
        })
        .catch(handleError);
    }

    /**
     * Adds a new seen poi to the collection, that matches the given parameter.
     * @param outingId The ID of the outing in which the poi has been seen
     * @param poiId The ID of the POI that have been seen.
     */
    function addOne(outingId, poiId) {
      return BioDb.getCollection(collName)
        .then(function(coll) {
          return coll.insertOne(new SeenClass(outingId, poiId));
        })
        .then(BioDb.save)
        .catch(handleError);
    }

    // TODO : supprimer en prod
    function populate(coll, outing_id) {
      coll.insert([
        new SeenClass(outing_id, 5007),
        new SeenClass(outing_id, 5010),
        new SeenClass(outing_id, 5291),
        new SeenClass(outing_id, 5391),
        new SeenClass(outing_id, 5018),
        new SeenClass(outing_id, 5347)
      ]);
      BioDb.save();
    }

    /**
     * Creates a new SeenClass with the given id.
     * The seenAt property of this object will be set as Date.now().
     * @param outing_id The id of the Outing in which the SeenClass must be added
     * @param poi_id The id of the new SeenClass
     * @constructor
     */
    function SeenClass(outing_id, poi_id) {
      this.outing_id = outing_id;
      this.poi_id = poi_id;
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