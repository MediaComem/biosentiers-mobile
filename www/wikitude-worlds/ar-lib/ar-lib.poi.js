/**
 * Created by Mathias on 04.05.2016.
 */
(function () {
  'use strict';

  angular
    .module('ARLib')
    .factory('POI', fnPOI);

  function fnPOI(Do, Markers, turf, UserLocation) {

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
          cam: [Markers.get(this.properties.theme_name), this.title]
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
        var near = [], toAdd = {ids: []};
        // removeCurrentStock();
        // Récupérer tous les points proches
        var pois = POI.stock.raw.features, nbPoi = POI.stock.raw.features.length;
        World.timer.start('firstloop');
        for (var i = 0; i < nbPoi; i++) {
          // Ajouter l'identifiant du point dans la liste des points proches
          if (isInReach(pois[i])) {
            var id = pois[i].properties.id_poi;
            // Ajouter l'identifiant du point dans la liste des points à ajouter
            near.push(id);
            // Ajouter l'identifiant du point comme propriété de la liste des objets à ajouter
            if (!isVisible(pois[i])) {
              toAdd.ids.push(id);
              toAdd[id] = pois[i];
            }
          }
        }
        // toAdd.ids contient les IDs des GeoObjets à ajouter
        // toAdd contient les GeoObjects à ajouter
        // near contient les IDs des GeoObjets à portée
        World.timer.firstloop.stop("First loop - iterating over every raw GeoObject :");
        World.timer.start('secondloop');
        // Supprimer les points hors de portée
        var nbDeleted = 0;
        for (var j = 0; j < POI.stock.visible.length; j++) {
          var id = POI.stock.visible[j];
          if (near.indexOf(id) === -1) {
            POI.stock.active[id].remove();
            nbDeleted++;
          }
        }
        World.timer.secondloop.stop('Second loop - Removing farest points');
        World.timer.start('thirdloop');
        // Ajouter les nouveaux points
        for (var k = 0; k < toAdd.ids.length; k++) {
          var id = toAdd.ids[k];
          POI.stock.active[id] = new POI(toAdd[id]);
        }
        World.timer.thirdloop.stop("Third loop - Adding closest points");
        POI.stock.visible = near;
        POI.stock.activeCount = Object.keys(POI.stock.active).length;
        World.timer.loadstock.stop('Load Stock total :');
        console.log('loaded', POI.stock);
        Do.action('toast', {message: toAdd.ids.length + " points en plus, " + nbDeleted + " points en moins"});
      }
    }

    //function removeCurrentStock() {
    //  AR.context.destroyAll();
    //  POI.stock.active = {};
    //  POI.stock.visible = [];
    //  POI.stock.activeCount = 0;
    //  console.log(Markers);
    //}

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
          Do.action('loadMarkerData', {id: this.id});
        } else {
          Do.action('toast', {message: "Vous êtes " + Math.round(dist - 20) + "m trop loin du point d'intérêt."});
        }
        return true; // Stop propagating the click event
      }
    }
  }
})();
