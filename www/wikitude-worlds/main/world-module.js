/**
 * Created by Mathias on 02.05.2016.
 */
var World;

angular
  .module('World', ['Do'])
  .run(run);

function run(Do) {
  World = {
    poi_marker: new AR.ImageResource("assets/location.png"),
    markerList: [],
    createMarker: function (poi_data) {
      console.log('marker being created based on :', poi_data);
      var markerLocation = new AR.GeoLocation(poi_data.latitude, poi_data.longitude, poi_data.altitude);
      console.log(markerLocation);
      var markerDrawable = new AR.ImageDrawable(this.poi_marker, 5, {
        zOrder: 0,
        opacity: 1.0,
        onClick: this.onMarkerClick
      });

      var name = new AR.Label(poi_data.marker, 1, {
        zOrder: 1,
        offsetY: 2,
        style: {
          textColor: '#FFFFFF',
          fontStyle: AR.CONST.FONT_STYLE.BOLD
        }
      });

      var distance = new AR.Label(Math.ceil(markerLocation.distanceToUser() / 1000) + ' Km(s)', 1, {
        zOrder: 2,
        offsetY: -2,
        style: {
          textColor: '#FFFFFF'
        }
      });

      var markerObject = new AR.GeoObject(markerLocation, {
        drawables: {
          cam: [markerDrawable, name, distance]
        }
      });
      console.log('marker loaded');
    },

    onScreenClick: function () {
      console.log('screen clicked');
    },

    onMarkerClick: function () {
      console.log('Marker clicked', this);
      return true;
    },

    talk: function(message) {
      console.log("World says : \"" + message + "\"");
    }
  };

  AR.context.scene.cullingDistance = 100000;
  AR.context.scene.scalingFactor = 0.2;
  AR.context.onScreenClick = World.onScreenClick;
  AR.context.onLocationChanged = function (lat, lon, alt, acc) {
    console.log('coord', lat, lon, alt, acc);
    Do.action('showPos', {lat: lat, lon: lon});
  };
}
