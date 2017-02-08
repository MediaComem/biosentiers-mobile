(function() {
  'use strict';
  angular
    .module('OutingsModule')
    .factory('Outings', Outings);

  function Outings(OutingClass, BioDb, $log, $q) {
    var deferred = $q.defer(),
        collection,
        collName = 'outings',
        outings,
        service  = {
          getAll     : getAll,
          getOne     : getOne,
          getPending : getPending,
          getOngoing : getOngoing,
          getFinished: getFinished,
          updateOne  : updateOne
        };

    return service;

    ////////////////////

    function getAll() {
      return BioDb.getCollection(collName)
        .then(function(coll) {
          var res = coll.find();
          if (res.length === 0) {
            populateDb(coll);
            res = coll.find();
          }
          console.log(coll);
          return res;
        }).catch(handleError);
    }

    function getOne(outingId) {
      return BioDb.getCollection(collName)
        .then(function(coll) {
          var res = coll.findOne({id: outingId});
          console.log('getOne - resultat', res);
          return res;
        }).catch(handleError);
    }

    function getPending() {
      return BioDb.getCollection(collName)
        .then(function(coll) {
          console.log(coll);
          return coll.chain().find({status: "pending"}).simplesort('id').data();
        }).catch(handleError);
    }

    function getOngoing() {
      return BioDb.getCollection(collName)
        .then(function(coll) {
          console.log(coll);
          return coll.chain().find({status: "ongoing"}).simplesort('id').data();
        }).catch(handleError)
    }

    function getFinished() {
      return BioDb.getCollection(collName)
        .then(function(coll) {
          console.log(coll);
          return coll.chain().find({status: "finished"}).simplesort('id').data();
        }).catch(handleError);
    }

    function updateOne(doc) {
      return BioDb.getCollection(collName)
        .then(function(coll) { coll.update(doc); console.log(coll);})
        .then(BioDb.save)
        .catch(handleError);
    }

    function populateDb(coll) {
      coll.insert(new OutingClass(3, 'Deuxième sortie de classe', 'pending', 'Mme Adams', '12.05.2016'));
      coll.insert(new OutingClass(1, 'Promenade de vacances', 'pending', 'Ben', '12.03.2016'));
      coll.insert(new OutingClass(4, 'Dernière sortie de classe', 'pending', 'Jens', '21.08.2016'));
      coll.insert(new OutingClass(2, 'Première sortie de classe', 'pending', 'Mr Harnold', '10.03.2016'));
      coll.insert(new OutingClass(5, 'Deuxième sortie de classe', 'pending', 'Mathias', '22.10.2016'));
      BioDb.save();
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
