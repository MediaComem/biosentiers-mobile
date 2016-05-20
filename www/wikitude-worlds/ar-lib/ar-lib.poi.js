/**
 * Created by Mathias on 04.05.2016.
 */
(function () {
  'use strict';

  angular
    .module('ARLib')
    .factory('POI', fnPOI);

  function fnPOI(Do, Markers) {
    function POI(data) {
      this.id = data.properties.id_poi;
      this.properties = data.properties;
      this.location = new AR.GeoLocation(data.geometry.coordinates[1], data.geometry.coordinates[0], data.geometry.coordinates[2]);
      this.title = null;
      this.geoObject = null;
    }

    POI.prototype.distanceToUser = distanceToUser;
    POI.prototype.show = show;
    POI.prototype.remove = remove;

    return POI;

    ////////////////////

    function distanceToUser() {
      return this.location.distanceToUser();
    }

    function show() {
      this.title = new AR.Label(this.id, 1, {
        zOrder: 1,
        offsetY: 2,
        style: {
          textColor: '#FFFFFF',
          fontStyle: AR.CONST.FONT_STYLE.BOLD
        }
      });

      this.geoObject = new AR.GeoObject(this.location, {
        onClick: getOnClick(this),
        drawables: {
          cam: [Markers.get(this.properties.theme_name), this.title]
        }
      });
    }

    function remove() {
      this.title.destroy();
      this.title.destroyed && (this.title = null);
      this.geoObject.destroy();
      this.geoObject.destroyed && (this.geoObject = null);
    }

    function getOnClick(poi) {
      return function onClick() {
        console.log('POI clicked', poi);
        var dist = poi.distanceToUser();
        console.log("distance to user ", dist);
        if (dist <= 20) {
          Do.action('loadMarkerData', {id: this.id});
        } else {
          Do.action('toast', {message: "Vous êtes " + Math.round(dist - 20) + "m trop loin du point d'intérêt."});
        }
        //$rootScope.$emit('marker:clicked');
        //console.log('action executed', World.currentPoiData);
        //clickCallback(World.currentPoiData);
        return true; // Stop propagating the click event
      }
    }
  }
})();
