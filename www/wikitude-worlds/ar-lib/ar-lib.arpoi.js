(function() {
  'use strict';

  angular
    .module('ARLib')
    .factory('ARPOI', ARPOIClass);

  function ARPOIClass(Markers) {

      function ARPOI(poi, enabled, onClick) {

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
            cam: [ Markers.get(this.properties.theme_name) ], //, this.title],
            radar: new AR.Circle(0.05, { style: { fillColor: '#83ff7b' } })
          }
        });
      }

      // Methods
      ARPOI.prototype.distanceToUser = function() {
        return this.location.distanceToUser();
      };

      ARPOI.prototype.remove = function() {
        this.title.destroy();
        this.title.destroyed && (this.title = null);
        this.location.destroy();
        this.location.destroyed && (this.location = null);
        this.geoObject.destroy();
        this.geoObject.destroyed && (this.geoObject = null);
      };

      return ARPOI;
    }
})();
