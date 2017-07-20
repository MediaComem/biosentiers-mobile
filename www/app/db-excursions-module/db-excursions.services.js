/**
 * This service is responsible for interacting with the local database,
 * but only when these interactions concerns Excursion(s) data.
 */
(function() {
  'use strict';
  angular
    .module('db-excursions-module')
    .factory('DbExcursions', DbExcursions);

  function DbExcursions(ExcursionClass, ExcursionsSettings, DbBio, $log, $q) {
    var COLL_NAME = 'excursions';
    var COLL_OPTIONS = {
      unique: ['id']
    };
    var service = {
      getAll           : getAll,
      getOne           : getOne,
      getStats         : getStats,
      updateOne        : updateOne,
      archiveOne       : archiveOne,
      restoreOne       : restoreOne,
      setOngoingStatus : setOngoingStatus,
      setFinishedStatus: setFinishedStatus,
      setNotNew        : setNotNew,
      setNew           : setNew,
      createOne        : createOne,
      countAll         : countAll
    };

    return service;

    ////////////////////

    /**
     * Retrieve all the saved Excursions
     * @param {Object} options An option object respecting the MongoDB syntax that will be used to filter the excursions.
     * @return {Promise} A promise of an array of Excursions
     */
    function getAll(options) {
      // If the Excursions are set to not show the Archived one, add the corresponding filter to find only excursions that have no archived_at value.
      if (!ExcursionsSettings.withArchive.value) {
        options.archived_at = {$eq: null};
      }
      return getCollection()
        .then(function(coll) {
          console.log('DbExcursions:getAll', coll, options);
          return coll.chain().find(options).simplesort('date', true).data();
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
          $log.log('DbExcursions:newExcursionData', newExcursionData);
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
     * Counts the number of Excursions in the database
     * @return {Promise} A promise of the number of Excursions in the DB
     */
    function countAll() {
      return getCollection()
        .then(function(coll) { return coll.count(); })
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
          all     : statuses.length,
          pending : 0,
          ongoing : 0,
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
        .then(DbBio.save)
        .catch(handleError);
    }

    /**
     * Archive the given excursion.
     * This means setting its 'archived_at' property to the current datetime.
     * This is only possible if this property has not already been set before.
     * @param excursion
     * @return {Promise}
     */
    function archiveOne(excursion) {
      if (!excursion) throw new TypeError('DbExcursions : archiveOne needs an Excursion object as its first argument, none given');
      if (excursion.archived_at !== null) return $q.resolve();
      excursion.archived_at = Date.now();
      return updateOne(excursion);
    }

    /**
     * Restore the given excursion.
     * This means setting its 'archived_at' property to null.
     * This is only possible if this property is not already equal to null.
     * @param excursion
     * @return {Promise}
     */
    function restoreOne(excursion) {
      if (!excursion) throw new TypeError('DbExcursions : restoreOne needs an Excursion object as its first argument, none given');
      if (excursion.archived_at === null) return $q.resolve();
      excursion.archived_at = null;
      return updateOne(excursion);
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
      if (!excursion) throw new TypeError('DbExcursions : setOngoingStatus needs an Excursion object as its first argument, none given');
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
      if (!excursion) throw new TypeError('DbExcursions : setFinishedStatus needs an Excursion object as its first argument, none given');
      if (excursion.status !== 'ongoing') return $q.resolve();
      excursion.status = 'finished';
      excursion.finished_at = Date.now();
      return updateOne(excursion);
    }

    /**
     * TODO: Comment this function
     * @param excursion
     * @return {Promise}
     */
    function setNotNew(excursion) {
      if (!excursion) throw new TypeError('DbExcursions : setNotNew needs an Excursion object as its first argument, none given');
      if (!excursion.is_new) return $q.resolve();
      excursion.is_new = false;
      return updateOne(excursion);
    }

    /**
     * Set the given excursion as "new".
     * This can only be done if the excursion is not already "new" and is in a "pending" state.
     * @param excursion
     * @return {Promise}
     */
    function setNew(excursion) {
      if (!excursion) throw new TypeError('DbExcursions : setNew needs an Excursion object as its first argument, none given');
      if (excursion.is_new || excursion.status !== 'pending') return $q.resolve();
      excursion.is_new = true;
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
      DbBio.save();
    }

    /**
     * TODO: Comment this function
     * @return {*|Collection}
     */
    function getCollection() {
      return DbBio.getCollection(COLL_NAME, COLL_OPTIONS);
    }
  }
})();
