/**
 * Created by Mathias Oberson on 07.02.2017.
 */
(function() {
  'use strict';
  angular
    .module('bio-db-module')
    .service('BioDb', BioDbService);

  function BioDbService($ionicPlatform, $log, Loki, $q) {
    var deferred = $q.defer(),
        db,
        service  = {
          getCollection: getCollection,
          reset        : reset,
          save         : save
        };

    return service;

    ////////////////////

    /**
     * Initializes the BioDb
     */
    function start() {
      if (!db) {
        $ionicPlatform.ready(function() {
          $log.log('initializing Loki');
          db = new Loki('db', {
            autosave        : true,
            autosaveInterval: 10000,
            adapter         : new LokiCordovaFSAdapter({'prefix': 'biosentiers'})
          });

          db.loadDatabase({}, function() {
            deferred.resolve();
          });
        });
      }
      return deferred.promise;
    }

    /**
     * Get a collection from the DB, based on its name.
     * If the required collection doesn't exist, it will be created, then returned.
     * @param name The name of the collection to access (or create if not existing)
     */
    function getCollection(name) {
      return start().then(function() {
        // db.removeCollection(name);
        var coll = db.getCollection(name);
        if (coll) return coll;
        coll = db.addCollection(name);
        return save().then(function() {
          return coll;
        });
      })
    }

    /**
     * Save the complete database on the device's filesystem.
     * @return {Promise} A promise of the database saved.
     */
    function save() {
      console.log('saving database');
      var deferred = $q.defer();
      db.saveDatabase(function(err) {
        err ? deferred.reject() : deferred.resolve();
      });
      return deferred.promise;
    }

    // TODO : Supprimer en prod
    function reset() {
      return start().then(function() {
        db.removeCollection('excursions');
        db.removeCollection('seen-pois');
        return save();
      })
    }
  }
})();