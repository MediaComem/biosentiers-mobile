(function() {
  'use strict';

  angular
    .module('ar-view')
    .factory('ArMarker', ArMarkerClass);

  function ArMarkerClass(ArIcons) {

    function ArMarker(poi, enabled, onClick) {

      this.poi = poi;
      this.id = poi.properties.id_poi;
      this.properties = poi.properties;

      this.location = new AR.GeoLocation(poi.geometry.coordinates[1], poi.geometry.coordinates[0], poi.geometry.coordinates[2]);

      this.title = new AR.Label(this.id, 1, {
        zOrder : 1,
        offsetY: 2,
        style  : {
          textColor: '#FFFFFF',
          fontStyle: AR.CONST.FONT_STYLE.BOLD
        }
      });

      this.geoObject = new AR.GeoObject(this.location, {
        enabled: enabled,
        onClick: onClick(this),
        drawables: {
          cam: [ ArIcons.get(this.properties.theme_name) ]
        }
      });
    }

    // Methods
    ArMarker.prototype.distanceToUser = function() {
      return this.location.distanceToUser();
    };

    ArMarker.prototype.remove = function() {
      this.title.destroy();
      this.title.destroyed && (this.title = null);
      this.location.destroy();
      this.location.destroyed && (this.location = null);
      this.geoObject.destroy();
      this.geoObject.destroyed && (this.geoObject = null);
    };

    return ArMarker;
  }
})();
