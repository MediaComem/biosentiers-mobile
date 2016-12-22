/**
 * Created by Mathias Oberson on 16.12.2016.
 */
(function() {
  'use strict';
  angular
    .module('seen-pois-data')
    .factory('SeenPoisData', SeenPoisDataService);

  function SeenPoisDataService($log, Loki, $q) {

    var deferred = $q.defer();
    var db,
        service = {
          getAll: getAll,
          save: save
        };

    return service;

    ////////////////////

    /**
     * Starts the database for the seen pois.
     * @return {Promise} Returns a promise of the started database.
     */
    function start() {
      if (!db) {
        $log.log('initializing Loki');
        db = new Loki('seen-pois', {
          autosave        : true,
          autosaveInterval: 30000,
          adapter         : new LokiCordovaFSAdapter({'prefix': 'biosentiers'})
        });

        db.loadDatabase({}, function() {
          $log.log(db);
          deferred.resolve();
        });
      }
      return deferred.promise;
    }

    /**
     * Tries to get all the POIs that have been seen for a particuler outing.
     * If it's the first time retrieving the POIs for this outing, the collection will be created.
     * By passing a True as the second parameter, it's possible to retrieve an Array containing the IDs of the POIs that have been seen.
     * By not passing a second parameter or by passing False, the result will be returned as they are in the database
     * @param outingId The ID of the Outing for which we want to get all the seen POIs.
     * @param asIdArray A Boolean indicating if the results should be returned as an array of IDs
     * @return {Promise} A promise of an Array containing the IDs of the POIs that have been seen for the specified Outing
     */
    function getAll(outingId, asIdArray) {
      if (!outingId) {
        throw new TypeError('SeenPoisData.getAll expected one argument, none given');
      }
      return start().then(function() {
        var seen = db.getCollection(outingId);
        if (!seen) {
          $log.log('No seen POIs. Creating the collection');
          seen = db.addCollection(outingId);
          init(seen);
          $log.log(db);
          db.saveDatabase();
        } else {
          $log.log('Some POIs seen. Database loaded', seen.data);
        }
        if (asIdArray === true) {
          return _.map(seen.data, 'id');
        } else {
          return seen.data;
        }
      });
    }

    /**
     * Saves the database on the file system.
     * @return {*|{value}}
     */
    function save() {
      return db.saveDatabase();
    }

    function init(seen) {
      seen.insert([
        {id: 5007, seenAt: Date.now()},
        {id: 5010, seenAt: Date.now()},
        {id: 5291, seenAt: Date.now()},
        {id: 5347, seenAt: Date.now()},
        {id: 5391, seenAt: Date.now()},
        {id: 5018, seenAt: Date.now()}
      ]);
    }
  }
})();