/**
 * This service is responsible for interacting with the local database,
 * but only when these interactions concerns Outing(s) data.
 */
(function() {
  'use strict';
  angular
    .module('outings-module')
    .factory('Outings', Outings);

  function Outings(OutingClass, BioDb, $log, $q) {
    var collName = 'outings',
        outings,
        service  = {
          getAll          : getAll,
          getOne          : getOne,
          getPending      : getPending,
          getOngoing      : getOngoing,
          getFinished     : getFinished,
          updateOne       : updateOne,
          setOngoingStatus: setOngoingStatus
        };

    return service;

    ////////////////////

    /**
     * Retrieve all the saved Outings
     * @return {Promise} A promise of an array of Outings
     */
    function getAll() {
      return BioDb.getCollection(collName)
        .then(function(coll) {
          var res = coll.find();
          if (res.length === 0) {
            populateDb(coll);
            res = coll.find();
          }
          return res;
        }).catch(handleError);
    }

    /**
     * Retrieve one outing, based on the given ID.
     * @param outingId The id corresponding to the requested Outing
     * @return {Promise} A promise of a single Outing object.
     */
    function getOne(outingId) {
      return BioDb.getCollection(collName)
        .then(function(coll) { return coll.findOne({id: outingId}); })
        .catch(handleError);
    }

    /**
     * Retrieve all the saved Outings that are in a 'pending' state.
     * @return {Promise} A promise of an array of Outings
     */
    function getPending() {
      return BioDb.getCollection(collName)
        .then(function(coll) { return coll.chain().find({status: "pending"}).simplesort('id').data(); })
        .catch(handleError);
    }

    /**
     * Retrieves all the saved Outings taht are in a 'ongoing' state.
     * @return {Promise} A promise of an array of Outings
     */
    function getOngoing() {
      return BioDb.getCollection(collName)
        .then(function(coll) { return coll.chain().find({status: "ongoing"}).simplesort('id').data(); })
        .catch(handleError)
    }

    /**
     * Retrieves all the saved Outings that are in a 'finished' state.
     * @return {Promise} A promise of an array of Outings
     */
    function getFinished() {
      return BioDb.getCollection(collName)
        .then(function(coll) { return coll.chain().find({status: "finished"}).simplesort('id').data(); })
        .catch(handleError);
    }

    /**
     * Updates a document in the local database that correspond to the given object.
     * The values of existing properties will be changed, new properties will be added and missing properties will be removed.
     * The object passed as a parameter must have the $loki and meta properties, required by LokiJS.
     * When the update is performed, the in-memory database is saved on the device's filesystem.
     * @param doc An object of the Outing to update
     */
    function updateOne(doc) {
      return BioDb.getCollection(collName)
        .then(function(coll) { coll.update(doc); })
        .then(BioDb.save)
        .catch(handleError);
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

    /**
     * Changes the status of a single outing, passed as argument, and updates this outing in the Loki DB.
     * Only an outing with a 'pending' status could have its status changed to 'ongoing'.
     * If you pass an outing with a status other than 'pending', the promise will resolve with no error, but the status will remain the same.
     * @param outing {OutingClass} The outing whose status should be set as oingoing
     */
    function setOngoingStatus(outing) {
      if (outing.status !== 'pending') return $q.resolve();
      console.log('setOngoingStatus', outing);
      outing.status = 'ongoing';
      outing.started_at = Date.now();
      console.log('setOngoingStatus - before update', outing);
      return updateOne(outing);
    }

    /**
     * TODO : supprimer en production
     * Insert dumy data inside the given collection
     * @param coll
     */
    function populateDb(coll) {
      coll.insert([
        new OutingClass(3, 'Deuxième sortie de classe', 'pending', 'Mme Adams', '12.05.2016'),
        new OutingClass(1, 'Promenade de vacances', 'pending', 'Ben', '12.03.2016'),
        new OutingClass(4, 'Dernière sortie de classe', 'pending', 'Jens', '21.08.2016'),
        new OutingClass(2, 'Première sortie de classe', 'pending', 'Mr Harnold', '10.03.2016'),
        new OutingClass(5, 'Deuxième sortie de classe', 'pending', 'Mathias', '22.10.2016')
      ]);
      BioDb.save();
    }
  }
})();
