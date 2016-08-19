/**
 * Created by Mathias on 04.05.2016.
 */
(function () {
  'use strict';

  angular
    .module('ARLib')
    .factory('POI', POIService);

  function POIService(ARPOI, Do, Filters, Markers, POIData, $rootScope, Timers, turf, UserLocation) {

    var POI = {};

    POI.loadStock = loadStock;
    POI.reachLimit = 250;
    POI.stock = {
      visible: {}, // Stocke les objets de POI actuellement affichés (une propriété pour chaque objet)
      visibleIds: [] // Stocke les ids des POI actuellement affichés
    };

    return POI;

    ////////////////////

    function loadStock() {
      if (POIData.hasData()) { // S'assurer que les données des points sont effectivement chargés.
        var timer = Timers.start();

        var visiblePois = POIData.getPois();
        visiblePois = getNearestPois(visiblePois);
        visiblePois = Filters.filterPois(visiblePois);

        var newVisibleIds = _.map(visiblePois, getPoiId);

        var changes = {
          added: [],
          deleted: [],
          visible: visiblePois
        };

        changes.removed = removeNoLongerVisiblePois(newVisibleIds);
        changes.added = addNewVisiblePois(visiblePois, newVisibleIds);

        POI.stock.visibleIds = newVisibleIds;

        timer.stop('load stock total');

        console.log('loaded', POI.stock);
        $rootScope.$emit('pois:changed', changes);
        //Do.action('toast', {message: changes.added.length + " points en plus, " + changes.removed.length + " points en moins"});
      }
    }

    function getNearestPois(pois) {
      return Timers.time('get nearest pois', function() {
        return _.filter(pois, isInReach);
      });
    }

    function addNewVisiblePois(pois) {
      return Timers.time('add new visible pois', function() {
        return _.filter(pois, function(poi) {
          if (!isVisible(poi)) {
            POI.stock.visible[getPoiId(poi)] = new ARPOI(poi, onArPoiClick);
            return true;
          }
        });
      });
    }

    function removeNoLongerVisiblePois(visibleIds) {
      return Timers.time('remove no longer visible pois', function() {
        return _.reduce(POI.stock.visibleIds, function(memo, id) {
          if (!_.includes(visibleIds, id)) {
            var arPoi = POI.stock.visible[id];
            memo.push(arPoi.poi);
            arPoi.remove();
            delete POI.stock.visible[id];
          }

          return memo;
        }, []);
      });
    }

    function isInReach(poi) {
      return turf.distance(UserLocation.current, poi) * 1000 < POI.reachLimit;
    }

    function isVisible(poi) {
      return POI.stock.visibleIds.indexOf(getPoiId(poi)) !== -1;
    }

    function onArPoiClick(arPoi) {
      return function onClick() {
        console.log('POI clicked', arPoi);
        var dist = arPoi.distanceToUser();
        console.log("distance to user ", dist);
        if (dist <= 20) {
          Do.action('loadMarkerData', { id: arPoi.id, properties: arPoi.properties });
        } else {
          Do.action('toast', { message: "Vous êtes " + Math.round(dist - 20) + "m trop loin du point d'intérêt." });
        }
        return true; // Stop propagating the click event
      }
    }

    function getPoiId(poi) {
      return poi.properties.id_poi;
    }
  }
})();
