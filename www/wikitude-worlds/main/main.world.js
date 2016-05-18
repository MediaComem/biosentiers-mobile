/**
 * Created by Mathias on 02.05.2016.
 */
angular
  .module('ar')
  .run(run);

function run(Do, POI, $rootScope) {
  World = {
    userCoord: {},
    markerList: [],
    poiData: null,
    loadPoiData: loadPoiData,
    write: write,
    timer: timer,
    createMarkers: function (markers) {
      var self = this, nbBird = 0, nbFlore = 0, nbOther = 0;
      //console.log(markers);
      markers.forEach(function (marker) {
        //switch (marker.properties.theme_name) {
        //  case "Oiseaux":
        //    console.log(marker.properties.theme_name);
        //    nbBird++;
        //    nbBird < 10 && self.markerList.push(new POI(marker)) && console.log("Oiseau");
        //    break;
        //  case "Flore":
        //    console.log(marker.properties.theme_name);
        //    nbFlore++;
        //    nbFlore < 10 && self.markerList.push(new POI(marker)) && console.log("Flore");
        //    break;
        //  default:
        //    console.log(marker.properties.theme_name);
        //    nbOther++;
        //    self.markerList.push(new POI(marker)) && console.log("default");
        //}
        self.markerList.push(new POI(marker));
      });
      //console.log("nbBird", nbBird);
      //console.log("nbFlore", nbFlore);
      //console.log("nbOther", nbOther);
    }
  };

  AR.context.clickBehavior = AR.CONST.CLICK_BEHAVIOR.TOUCH_DOWN;
  AR.context.scene.cullingDistance = 250;
  AR.context.scene.maxScalingDistance = 250;
  AR.context.scene.minScalingDistance = 5;
  AR.context.scene.scalingFactor = 0.2;
  AR.context.onScreenClick = onScreenClick;
  AR.context.onLocationChanged = onLocationChanged;

  ////////////////////

  function onScreenClick() {
    console.log('screen clicked', World);
  }

  function onLocationChanged(lat, lon, alt, acc) {
    console.log('coord', lat, lon, alt, acc);
    World.userCoord = {lat: lat, lon: lon, alt: alt};
    Do.action('showPos', World.userCoord);
  }

  function loadPoiData(data) {
    console.log('setting the poi data');
    World.poiData = data;
    $rootScope.$emit('marker:loaded');
  }

  function write(message) {
    console.log("World writes", message);
  }

  function timer(start) {
    var stop = Date.now();
    console.log("Débuté", start);
    console.log("Terminé", stop);
    console.log("Diff1", (stop - start) / 1000);
  }
}
