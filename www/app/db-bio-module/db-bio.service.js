/**
 * Created by Mathias Oberson on 07.02.2017.
 */
(function() {
  'use strict';
  angular
    .module('db-bio-module')
    .service('DbBio', DbBioService);

  function DbBioService($ionicPlatform, $log, Loki, $q) {
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
     * Initializes the DbBio
     */
    function start(name) {
      if (!db) {
        $ionicPlatform.ready(function() {
          $log.log('initializing Loki for', name);
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
     * If the required collection doesn't exist, it will be created with the given options, then returned.
     * @param name The name of the collection to access (or create if not existing)
     * @param options Options to be applied to the collection when created.
     */
    function getCollection(name, options) {
      return start(name).then(function() {
        // db.removeCollection(name);
        var coll = db.getCollection(name);
        if (coll) return coll;
        $log.log('DbBio:getCollection:' + name + ' options', options);
        coll = db.addCollection(name, options);
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
      $log.info('DbBio:save: initiating the database save');
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
        $log.log('DbBio:reset', db);
        save().then(function() {
          db = null;
        });
      })
    }
  }
})();
