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
    var COLL_NAME = 'outings';
    var service  = {
          getAll           : getAll,
          getOne           : getOne,
          getPending       : getPending,
          getOngoing       : getOngoing,
          getFinished      : getFinished,
          updateOne        : updateOne,
          setOngoingStatus : setOngoingStatus,
          setFinishedStatus: setFinishedStatus,
          createOne        : createOne
        };

    return service;

    ////////////////////

    /**
     * Retrieve all the saved Outings
     * @return {Promise} A promise of an array of Outings
     */
    function getAll() {
      return BioDb.getCollection(COLL_NAME)
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
     * Creates a new Outing in the database, based on the data provided through newOutingData
     * @param newOutingData An object representing the data for the new Outing
     * @return {Promise} A promise of a new Outing
     */
    function createOne(newOutingData) {
      return BioDb.getCollection(COLL_NAME)
        .then(function(coll) {
          $log.log(newOutingData);
          var newOuting = new OutingClass(newOutingData);
          $log.log(newOuting);
          coll.insert(newOuting);
        }).catch(handleError);
    }

    /**
     * Retrieve one outing, based on the given ID.
     * @param outingId The id corresponding to the requested Outing
     * @return {Promise} A promise of a single Outing object.
     */
    function getOne(outingId) {
      return BioDb.getCollection(COLL_NAME)
        .then(function(coll) { return coll.findOne({id: outingId}); })
        .catch(handleError);
    }

    /**
     * Retrieve all the saved Outings that are in a 'pending' state.
     * @return {Promise} A promise of an array of Outings
     */
    function getPending() {
      return BioDb.getCollection(COLL_NAME)
        .then(function(coll) { return coll.chain().find({status: "pending"}).simplesort('id').data(); })
        .catch(handleError);
    }

    /**
     * Retrieves all the saved Outings taht are in a 'ongoing' state.
     * @return {Promise} A promise of an array of Outings
     */
    function getOngoing() {
      return BioDb.getCollection(COLL_NAME)
        .then(function(coll) { return coll.chain().find({status: "ongoing"}).simplesort('id').data(); })
        .catch(handleError)
    }

    /**
     * Retrieves all the saved Outings that are in a 'finished' state.
     * @return {Promise} A promise of an array of Outings
     */
    function getFinished() {
      return BioDb.getCollection(COLL_NAME)
        .then(function(coll) { return coll.chain().find({status: "finished"}).simplesort('id').data(); })
        .catch(handleError);
    }

    /**
     * Updates a document in the local database that correspond to the given object.
     * The values of existing properties will be changed, new properties will be added and missing properties will be removed.
     * The object passed as a parameter must have the $loki and meta properties, required by LokiJS.
     * When the update is performed, the in-memory database is saved on the device's filesystem.
     * @param doc An object of the Outing to update
     * @return {Promise} A promise of an updated document.
     */
    function updateOne(doc) {
      return BioDb.getCollection(COLL_NAME)
        .then(function(coll) { coll.update(doc); })
        .then(BioDb.save)
        .catch(handleError);
    }

    /**
     * Determines how to react to an error when a query is executed.
     * Right now, this does nothing more than logging said error and returning it as a rejected Promise.
     * @param {*} error
     * @return {Promise} A rejected promise whose value is the received error.
     */
    function handleError(error) {
      $log.error(error);
      return $q.reject(error);
    }

    /**
     * Changes the status of a single outing, passed as argument, and updates this outing in the Loki DB.
     * Only an outing with a 'pending' status could have its status changed to 'ongoing'.
     * If you pass an outing with a status other than 'pending', the promise will be resolved, but the outing will remain untouched.
     * @param {OutingClass} outing The outing whose status should be set as 'oingoing'
     * @param {String} outing.status This property must have a value of 'pending'. It will be set to 'ongoing'
     * @param {Number} outing.started_at This property should be empty. It will be set as the current timestamp.
     * @return {Promise} A promise of an updated Outing
     */
    function setOngoingStatus(outing) {
      if (!outing) throw new TypeError('Outings : setOngoingStatus needs an Outing object as its first argument, none given');
      if (outing.status !== 'pending') return $q.resolve();
      outing.status = 'ongoing';
      outing.started_at = Date.now();
      return updateOne(outing);
    }

    /**
     * Changes the status of a single outing, passed as argument, and updates this outing in the Loki DB.
     * Only an outing with an 'ongoing' status value can have its status changed to 'finished'.
     * Note that if you pass an outing with a status other than 'ongoing', the promise will be resolved, but the outing will remain untouched.
     * @param {OutingClass} outing The outing whose status should be set as 'finished'
     * @param {String} outing.status This property must have a value of 'ongoing'. It will be set to 'finished'
     * @param {Number} outing.finished_at This property should be empty. It will be set as the current timestamp.
     * @return {Promise} A promise of an updated Outing
     */
    function setFinishedStatus(outing) {
      if (!outing) throw new TypeError('Outings : setFinishedStatus needs an Outing object as its first argument, none given');
      if (outing.status !== 'ongoing') return $q.resolve();
      outing.status = 'finished';
      outing.finished_at = Date.now();
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
