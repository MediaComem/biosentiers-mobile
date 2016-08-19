/**
 * Created by Mathias on 04.05.2016.
 */
(function () {
  'use strict';

  angular
    .module('ARLib')
    .factory('POI', POIService)
    .factory('POIData', POIDataService);

  function POIDataService($rootScope) {

    var service = {
      data: null,

      hasData: function() {
        return !!service.data;
      },

      setData: function(data) {
        service.data = data;

        if (data) {
          $rootScope.$emit('poiData:changed');
        }
      },

      getPois: function() {
        return service.data ? service.data.features : [];
      },

      getThemes: function() {
        return service.data ? _.compact(_.uniq(_.map(service.data.features, 'properties.theme_name'))).sort() : [];
      }
    };

    return service;
  }

  function POIService(Do, Filters, Markers, POIData, $rootScope, Timers, turf, UserLocation) {

    // Static
    POI.loadStock = loadStock;
    POI.reachLimit = 250;
    POI.stock = {
      visible: {}, // Stocke les objets de POI actuellement affichés (une propriété pour chaque objet)
      visibleIds: [] // Stocke les ids des POI actuellement affichés
    };

    /**
     * @param data
     * @constructor
     */
    function POI(data) {
      this.id = getPoiId(data);
      this.properties = data.properties;
      this.location = new AR.GeoLocation(data.geometry.coordinates[1], data.geometry.coordinates[0], data.geometry.coordinates[2]);
      this.title = new AR.Label(this.id, 1, {
        zOrder : 1,
        offsetY: 2,
        style  : {
          textColor: '#FFFFFF',
          fontStyle: AR.CONST.FONT_STYLE.BOLD
        }
      });

      this.geoObject = new AR.GeoObject(this.location, {
        onClick  : onPoiClick(this),
        drawables: {
          cam  : [Markers.get(this.properties.theme_name)], //, this.title],
          radar: new AR.Circle(0.05, {style: {fillColor: '#83ff7b'}})
        }
      });
    }

    // Methods
    POI.prototype.distanceToUser = distanceToUser;
    POI.prototype.remove = remove;

    return POI;

    ////////////////////

    function loadStock() {
      if (POIData.hasData()) { // S'assurer que les données des points sont effectivement chargés.
        var timer = Timers.start();

        var allPois = POIData.getPois();
        var nearestPois = getNearestPois(allPois);
        var filteredPois = Filters.filterPois(nearestPois);

        var newVisibleIds = _.map(filteredPois, getPoiId);

        var toAdd = getNewVisiblePois(allPois, newVisibleIds);
        var nbDeleted = removeNoLongerVisiblePois(newVisibleIds);

        addNewVisiblePois(toAdd);
        POI.stock.visibleIds = newVisibleIds;

        timer.stop('load stock total');

        console.log('loaded', POI.stock);
        $rootScope.$emit('stats:update', toAdd.length, nbDeleted, POI.stock.visibleIds.length);
        //Do.action('toast', {message: toAdd.length + " points en plus, " + nbDeleted + " points en moins"});
      }
    }

    function getNearestPois(pois) {
      return Timers.time('get nearest pois', function() {
        return _.filter(pois, isInReach);
      });
    }

    function getNewVisiblePois(pois, visibleIds) {
      return Timers.time('get new visible pois', function() {
        return _.filter(pois, function(poi) {
          return _.includes(visibleIds, getPoiId(poi)) && !isVisible(poi);
        });
      });
    }

    function removeNoLongerVisiblePois(visibleIds) {
      return Timers.time('remove no longer visible pois', function() {

        var removedCount = 0;

        _.each(POI.stock.visibleIds, function(id) {
          if (!_.includes(visibleIds, id)) {
            POI.stock.visible['' + id].remove();
            removedCount++;
          }
        });

        return removedCount;
      });
    }

    function addNewVisiblePois(pois) {
      return Timers.time('add new visible pois', function() {
        _.each(pois, function(poi) {
          POI.stock.visible['' + getPoiId(poi)] = new POI(poi);
        });
      });
    }

    function isInReach(poi) {
      return turf.distance(UserLocation.current, poi) * 1000 < POI.reachLimit;
    }

    function isVisible(poi) {
      return POI.stock.visibleIds.indexOf(getPoiId(poi)) !== -1;
    }

    function distanceToUser() {
      return this.location.distanceToUser();
    }

    function remove() {
      this.title.destroy();
      this.title.destroyed && (this.title = null);
      this.location.destroy();
      this.location.destroyed && (this.location = null);
      this.geoObject.destroy();
      this.geoObject.destroyed && (this.geoObject = null);
      delete POI.stock.visible['' + this.id];
    }

    function onPoiClick(poi) {
      return function onClick() {
        console.log('POI clicked', poi);
        var dist = poi.distanceToUser();
        console.log("distance to user ", dist);
        if (dist <= 20) {
          Do.action('loadMarkerData', {id: poi.id, properties: poi.properties});
        } else {
          Do.action('toast', {message: "Vous êtes " + Math.round(dist - 20) + "m trop loin du point d'intérêt."});
        }
        return true; // Stop propagating the click event
      }
    }

    function getPoiId(poi) {
      return poi.properties.id_poi;
    }
  }
})();
