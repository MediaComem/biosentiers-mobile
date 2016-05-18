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
      var self = this;
      self.id = data.properties.id_poi;
      self.properties = data.properties;
      self.coord = {lon: data.geometry.coordinates[0], lat: data.geometry.coordinates[1], alt: data.geometry.coordinates[2]};

      self.location = new AR.GeoLocation(this.coord.lat, this.coord.lon, this.coord.alt);

      //self.marker = marker;

      self.name = new AR.Label(self.id, 1, {
        zOrder: 1,
        offsetY: 2,
        style: {
          textColor: '#FFFFFF',
          fontStyle: AR.CONST.FONT_STYLE.BOLD
        }
      });

      self.geoObject = new AR.GeoObject(self.location, {
        onClick: onClick,
        drawables: {
          cam: [Markers.get(self.properties.theme_name), self.name]
        }
      });

      ////////////////////

      function onClick(e) {
        console.log('payload', e);
        console.log('POI clicked', self);
        var dist = self.location.distanceToUser();
        console.log("distance to user ", dist);
        if (dist <= 20) {
          Do.action('loadMarkerData', {id: self.id});
        } else {
          Do.action('toast', {message: "Vous êtes " + Math.round(dist - 20) + "m trop loin du point d'intérêt."});
        }
        //$rootScope.$emit('marker:clicked');
        //console.log('action executed', World.currentPoiData);
        //clickCallback(World.currentPoiData);
        return true; // Stop propagating the click event
      }
    }

    return POI;
  }
})();
