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
          save: save,
          addOne: addOne
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
     * By passing True as the second parameter, it's possible to retrieve an Array containing the IDs of the POIs that have been seen.
     * By not passing a second parameter or by passing False, the result will be returned as they are in the database
     * @param outingId The ID of the Outing for which we want to get all the seen POIs.
     * @param asIdArray A Boolean indicating if the results should be returned as an array of IDs
     * @return {Promise} A promise of an Array containing the IDs of the POIs that have been seen for the specified Outing
     */
    function getAll(outingId, asIdArray) {
      if (!outingId || typeof outingId === "boolean") {
        throw new TypeError('SeenPoisData.getAll expect first parameter to be an Outing Id');
      }
      return start().then(function() {
        var seen = db.getCollection(outingId);
        if (!seen) {
          $log.log('No seen POIs. Creating the collection');
          seen = db.addCollection(outingId);
          init(seen);
          $log.log(db);
          save();
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

    /**
     * Adds a new seen poi in the adequate database, based on the given outingId.
     * @param outingId The ID of the outing in which the poi has been seen
     * @param poiId The ID of the POI that have been seen.
     */
    function addOne(outingId, poiId) {
      var seen = db.getCollection(outingId);
      seen.insertOne(new SeenObject(poiId));
      $log.log(db, seen);
    }

    /**
     * DEV
     * Add some random seen pois to the database to populate it.
     * @param seen The database in which the seenPois will be added
     */
    function init(seen) {
      seen.insert([
        new SeenObject(5007),
        new SeenObject(5010),
        new SeenObject(5291),
        new SeenObject(5391),
        new SeenObject(5018),
        new SeenObject(5347)
      ]);
    }

    /**
     * Creates a new SeenObject with the given id.
     * The seenAt property of this object will be set as Date.now().
     * @param id The id of the new SeenObject
     * @constructor
     */
    function SeenObject(id) {
      this.id = id;
      this.seenAt = Date.now();
    }
  }
})();