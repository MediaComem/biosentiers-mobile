/**
 * Created by Mathias on 04.05.2016.
 */
(function () {
  'use strict';

  angular
    .module('ARLib')
    .factory('POI', fnPOI);

  function fnPOI(Do, Markers, turf, UserLocation, $rootScope) {

    // Static
    POI.setRawStock = setRawStock;
    POI.loadStock = loadStock;
    POI.reachLimit = 250;
    POI.stock = {
      raw        : null,
      active     : {}, // Stocke les objets de POI actuellement affichés (une propriété pour chaque objet)
      visible    : [], // Stocke les ids des POI actuellement affichés
      activeCount: 0
    };

    /**
     * @param data
     * @constructor
     */
    function POI(data) {
      this.id = data.properties.id_poi;
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

    function setRawStock(stock) {
      console.log(stock);
      POI.stock.raw = stock;
    }

    function loadStock() {
      if (POI.stock.raw) { // S'assurer que les données des points sont effectivement chargés.
        World.timer.start('loadstock');
        var pois = POI.stock.raw.features;
        var near = getNearest(pois);
        var toAdd = getNewest(pois, near);
        var nbDeleted = removeFarest(near);
        showClosest(toAdd);
        POI.stock.visible = near;
        POI.stock.activeCount = Object.keys(POI.stock.active).length;
        World.timer.loadstock.stop('Load Stock total :');
        console.log('loaded', POI.stock);
        $rootScope.$emit('stats:update', toAdd.ids.length, nbDeleted, POI.stock.activeCount);
        //Do.action('toast', {message: toAdd.ids.length + " points en plus, " + nbDeleted + " points en moins"});
      }
    }

    function getNearest(pois) {
      World.timer.start('getnearest');
      var nbPoi = pois.length, res = [];
      for (var i = 0; i < nbPoi; i++) {
        if (isInReach(pois[i])) {
          var id = pois[i].properties.id_poi;
          res.push(id);
        }
      }
      World.timer.getnearest.stop('get nearest');
      return res;
    }

    function getNewest(pois, near) {
      World.timer.start('getnewest');
      var nbPoi = pois.length, res = {ids: []};
      for (var i = 0; i < nbPoi; i++) {
        var id = pois[i].properties.id_poi;
        if (near.indexOf(id) !== -1 && !isVisible(pois[i])) {
          res.ids.push(id);
          res[id] = pois[i];
        }
      }
      World.timer.getnewest.stop('get newest');
      return res;
    }

    function removeFarest(near) {
      World.timer.start('removefarest');
      var res = 0;
      for (var j = 0; j < POI.stock.visible.length; j++) {
        var id = POI.stock.visible[j];
        if (near.indexOf(id) === -1) {
          POI.stock.active[id].remove();
          res++;
        }
      }
      World.timer.removefarest.stop('remove farest');
      return res;
    }

    function showClosest(toAdd) {
      World.timer.start('showclosest');
      for (var k = 0; k < toAdd.ids.length; k++) {
        var id = toAdd.ids[k];
        POI.stock.active[id] = new POI(toAdd[id]);
      }
      World.timer.showclosest.stop('show closest');
    }

    function isInReach(poi) {
      return turf.distance(UserLocation.current, poi) * 1000 < POI.reachLimit;
    }

    function isVisible(poi) {
      return POI.stock.visible.indexOf(poi.properties.id_poi) !== -1;
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
      delete POI.stock.active[this.id];
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
  }
})();
