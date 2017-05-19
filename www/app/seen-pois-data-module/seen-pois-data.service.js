/**
 * Created by Mathias Oberson on 16.12.2016.
 */
(function() {
  'use strict';
  angular
    .module('seen-pois-data-module')
    .factory('SeenPoisData', SeenPoisDataService);

  function SeenPoisDataService(BioDb, $log, Loki, $q, rx) {

    var deferred       = $q.defer(),
        db,
        collName       = 'seen-pois',
        seenPoiSubject = new rx.ReplaySubject(1),
        service        = {
          getAll    : getAll,
          countFor  : countFor,
          addOne    : addOne,
          seenPoiObs: seenPoiSubject.asObservable()
        };

    return service;

    ////////////////////

    /**
     * Tries to get all the POIs that have been seen for a particuler excursion.
     * @param excursionId The ID of the Excursion for which we want to get all the seen POIs.
     * @return {Promise} A promise of an Array containing the POIs that have been seen for the specified Excursion
     */
    function getAll(excursionId) {
      return BioDb.getCollection(collName)
        .then(function(coll) {
          var res = coll.find({excursion_id: excursionId});
          if (res.length === 0) {
            populate(coll, excursionId);
            res = coll.find({excursion_id: excursionId});
          }
          return res;
        })
        .catch(handleError);
    }

    function countFor(excursionId) {
      $log.log('countFor id', excursionId);
      return BioDb.getCollection(collName)
        .then(function(coll) {
          $log.log('coutnFor collection', coll);
          return coll.count({excursion_id: excursionId});
        }).catch(handleError);
    }

    /**
     * Adds a new seen poi to the collection, that matches the given parameter.
     * @param excursionId The ID of the excursion in which the poi has been seen
     * @param poiId The ID of the POI that have been seen.
     * @param poiData The GeoJSON object of the seen POI.
     */
    function addOne(excursionId, poiId, poiData) {
      return BioDb.getCollection(collName)
        .then(function(coll) {
          var res = coll.insertOne(new Seen(excursionId, poiId, poiData));
          if ('undefined' === typeof res) throw new Error("SeenPoisData:addOne: An error occured while trying to save that the POI n°" + poiId + " had been seen in the excursion n°" + excursionId);
          return countFor(excursionId);
        })
        .then(function(count) {
          seenPoiSubject.onNext({excursionId: excursionId, nbSeen: count});
        })
        .then(BioDb.save)
        .catch(handleError);
    }


    // TODO : supprimer en prod
    function populate(coll, excursionId) {
      var poiData = {
        geometry  : {
          coordinates: [
            6.64853712883608,
            46.7817862925931,
            431.8
          ],
          type       : "Point"
        },
        properties: {
          common_name : {
            de: "Thunbergs Berberitze",
            fr: "Epine-vinette de Thunberg",
            it: "Crespino di Thunberg",
            la: "Berberis thunbergii"
          },
          created_at  : "20170402112523",
          id_poi      : 166,
          id_specie   : 122,
          id_zone     : 1,
          owner_name  : "Alain Jotterand",
          period_end  : 5,
          period_start: 5,
          theme_name  : "tree"
        },
        type      : "Feature"
      };
      coll.insert([
        new Seen(excursionId, 5007, poiData),
        new Seen(excursionId, 5010, poiData),
        new Seen(excursionId, 5291, poiData),
        new Seen(excursionId, 5391, poiData),
        new Seen(excursionId, 5018, poiData),
        new Seen(excursionId, 5347, poiData)
      ]);
      BioDb.save();
    }

    /**
     * Creates a new Seen object, that represents a POI seen in an Excursion
     * The seenAt property of this object will be set as Date.now().
     * @param excursionId The id of the Excursion in which the POI has been seen
     * @param poiId The id of the POI that has been seen
     * @param poiData The GeoJSON data of the seen POI
     * @constructor
     */
    function Seen(excursionId, poiId, poiData) {
      this.excursion_id = excursionId;
      this.poi_id = poiId;
      this.poi_data = poiData;
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
