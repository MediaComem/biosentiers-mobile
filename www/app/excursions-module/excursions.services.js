/**
 * This service is responsible for interacting with the local database,
 * but only when these interactions concerns Excursion(s) data.
 */
(function() {
  'use strict';
  angular
    .module('excursions-module')
    .factory('Excursions', Excursions);

  function Excursions(ExcursionClass, BioDb, $log, $q) {
    var COLL_NAME = 'excursions';
    var COLL_OPTIONS = {
      unique: ['id']
    };
    var service = {
      getAll           : getAll,
      getOne           : getOne,
      getPending       : getPending,
      getOngoing       : getOngoing,
      getFinished      : getFinished,
      getStats         : getStats,
      updateOne        : updateOne,
      setOngoingStatus : setOngoingStatus,
      setFinishedStatus: setFinishedStatus,
      isNotNew         : isNotNew,
      createOne        : createOne
    };

    return service;

    ////////////////////

    /**
     * Retrieve all the saved Excursions
     * @return {Promise} A promise of an array of Excursions
     */
    function getAll() {
      return getCollection()
        .then(function(coll) {
          $log.log('Excursion:collection', coll);
          var res = coll.chain().find().simplesort('date', true).data();
          // if (res.length === 0) {
          //   populateDb(coll);
          //   res = coll.chain().find().simplesort('date', true).data();
          // }
          $log.log('Excursion:getAll', res);
          return res;
        }).catch(handleError);
    }

    /**
     * Creates a new Excursion in the database, based on the data provided through newExcursionData
     * @param newExcursionData An object representing the data for the new Excursion
     * @return {Promise} A promise of a new Excursion
     */
    function createOne(newExcursionData) {
      return getCollection()
        .then(function(coll) {
          $log.log('Excursions:newExcursionData', newExcursionData);
          var newExcursion = ExcursionClass.fromQrCodeData(newExcursionData);
          $log.log(newExcursion);
          coll.insert(newExcursion);
        }).catch(handleError);
    }

    /**
     * Retrieve one excursion, based on the given ID.
     * @param excursionId The id corresponding to the requested Excursion
     * @return {Promise} A promise of a single Excursion object.
     */
    function getOne(excursionId) {
      return getCollection()
        .then(function(coll) { return coll.findOne({id: excursionId}); })
        .catch(handleError);
    }

    /**
     * Retrieve all the saved Excursions that are in a 'pending' state.
     * @return {Promise} A promise of an array of Excursions
     */
    function getPending() {
      return getCollection()
        .then(function(coll) { return coll.chain().find({status: "pending"}).simplesort('id').data(); })
        .catch(handleError);
    }

    /**
     * Retrieves all the saved Excursions taht are in a 'ongoing' state.
     * @return {Promise} A promise of an array of Excursions
     */
    function getOngoing() {
      return getCollection()
        .then(function(coll) { return coll.chain().find({status: "ongoing"}).simplesort('id').data(); })
        .catch(handleError)
    }

    /**
     * Retrieves all the saved Excursions that are in a 'finished' state.
     * @return {Promise} A promise of an array of Excursions
     */
    function getFinished() {
      return getCollection()
        .then(function(coll) { return coll.chain().find({status: "finished"}).simplesort('id').data(); })
        .catch(handleError);
    }

    /**
     * Returns information about the excursions as an object with the properties all, pending, ongoing and finished.
     * Each of these properties's value will be the number of corresponding excursions.
     * @return {Promise}
     */
    function getStats() {
      return getCollection()
        .then(function(coll) {
          return coll.chain().find().mapReduce(statsMap, statsReduce);
        })
        .catch(handleError);

      ////////////////////

      /**
       * Maps the received elements to their corresponding status.
       * @param element The current element
       */
      function statsMap(element) {
        return element.status;
      }

      /**
       * Aggregate the statutes as an object of count.
       * @param statuses An array of all the excursions statuses.
       * @return {{all, pending: number, ongoing: number, finished: number}}
       */
      function statsReduce(statuses) {
        var stats = {
          all: statuses.length,
          pending: 0,
          ongoing: 0,
          finished: 0
        };
        statuses.forEach(function(element) {
          $log.log('element', element);
          stats[element] += 1;
        });
        return stats;
      }
    }

    /**
     * Updates a document in the local database that correspond to the given object.
     * The values of existing properties will be changed, new properties will be added and missing properties will be removed.
     * The object passed as a parameter must have the $loki and meta properties, required by LokiJS.
     * When the update is performed, the in-memory database is saved on the device's filesystem.
     * @param doc An object of the Excursion to update
     * @return {Promise} A promise of an updated document.
     */
    function updateOne(doc) {
      return getCollection()
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
     * Changes the status of a single excursion, passed as argument, and updates this excursion in the Loki DB.
     * Only an excursion with a 'pending' status could have its status changed to 'ongoing'.
     * If you pass an excursion with a status other than 'pending', the promise will be resolved, but the excursion will remain untouched.
     * @param {ExcursionClass} excursion The excursion whose status should be set as 'oingoing'
     * @param {String} excursion.status This property must have a value of 'pending'. It will be set to 'ongoing'
     * @param {Number} excursion.started_at This property should be empty. It will be set as the current timestamp.
     * @return {Promise} A promise of an updated Excursion
     */
    function setOngoingStatus(excursion) {
      if (!excursion) throw new TypeError('Excursions : setOngoingStatus needs an Excursion object as its first argument, none given');
      if (excursion.status !== 'pending') return $q.resolve();
      excursion.status = 'ongoing';
      excursion.started_at = Date.now();
      return updateOne(excursion);
    }

    /**
     * Changes the status of a single excursion, passed as argument, and updates this excursion in the Loki DB.
     * Only an excursion with an 'ongoing' status value can have its status changed to 'finished'.
     * Note that if you pass an excursion with a status other than 'ongoing', the promise will be resolved, but the excursion will remain untouched.
     * @param {ExcursionClass} excursion The excursion whose status should be set as 'finished'
     * @param {String} excursion.status This property must have a value of 'ongoing'. It will be set to 'finished'
     * @param {Number} excursion.finished_at This property should be empty. It will be set as the current timestamp.
     * @return {Promise} A promise of an updated Excursion
     */
    function setFinishedStatus(excursion) {
      if (!excursion) throw new TypeError('Excursions : setFinishedStatus needs an Excursion object as its first argument, none given');
      if (excursion.status !== 'ongoing') return $q.resolve();
      excursion.status = 'finished';
      excursion.finished_at = Date.now();
      return updateOne(excursion);
    }

    function isNotNew(excursion) {
      if (!excursion) throw new TypeError('Excursions : isNotNew needs an Excursion object as its first argument, none given');
      if (!excursion.is_new) return $q.resolve();
      excursion.is_new = false;
      return updateOne(excursion);
    }

    /**
     * TODO : supprimer en production
     * Insert dumy data inside the given collection
     * @param coll
     */
    function populateDb(coll) {
      var participant = {
        id  : 'xf8',
        name: 'Robert'
      };
      var themes = ['bird', 'flower', 'butterfly', 'tree'];
      var zones = [1, 5, 8];
      coll.insert([
        new ExcursionClass('Mme Adams', '3', new Date('2016.05.12'), 'Deuxième sortie de classe', participant, themes, zones),
        new ExcursionClass('Ben', '1', new Date('2016.03.12'), 'Promenade de vacances', participant, themes, zones),
        new ExcursionClass('Jens', '4', new Date('2016.08.21'), 'Dernière sortie de classe', participant, themes, zones),
        new ExcursionClass('Mr Harnold', '2', new Date('2016.03.10'), 'Première sortie de classe', participant, themes, zones),
        new ExcursionClass('Mathias', '5', new Date('2016.10.22'), 'Deuxième sortie de classe', participant, themes, zones)
      ]);
      BioDb.save();
    }

    function getCollection() {
      return BioDb.getCollection(COLL_NAME, COLL_OPTIONS);
    }
  }
})();
