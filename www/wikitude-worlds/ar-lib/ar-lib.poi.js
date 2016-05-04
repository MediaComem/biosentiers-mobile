/**
 * Created by Mathias on 04.05.2016.
 */
(function () {
  'use strict';

  angular
    .module('ARLib')
    .factory('POI', fnPOI);

  function fnPOI(Markers) {
    function POI(data) {
      var self = this;
      self.id = data.id;
      self.coord = {lat: data.lat, lon: data.lon, alt: data.alt};

      self.location = new AR.GeoLocation(this.coord.lat, this.coord.lon, this.coord.alt);

      self.marker = new AR.ImageDrawable(Markers.default, 5, {
        zOrder: 0,
        opacity: 1.0,
        onClick: onClick
      });

      self.name = new AR.Label(data.name, 1, {
        zOrder: 1,
        offsetY: 2,
        style: {
          textColor: '#FFFFFF',
          fontStyle: AR.CONST.FONT_STYLE.BOLD
        }
      });

      self.geoObject = new AR.GeoObject(self.location, {
        drawables: {
          cam: [self.marker, self.name]
        }
      });

      function onClick() {
        console.log('POI clicked', self);
        return true; // Stop propagating the touch event
      }
    }

    //POI.prototype.onClick = function onClick() {
    //  console.log('POI clicked', this);
    //  return true; // Stop propagating the touch event
    //};

    return POI;
  }
})();
