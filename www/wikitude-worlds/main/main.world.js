/**
 * Created by Mathias on 02.05.2016.
 */
angular
  .module('ar')
  .run(run);

function run(Do, POI, Beacon, $rootScope) {
  World = {
    userCoord: {},
    pois: {},
    visible: [],
    beacons: [],
    poiData: null,
    loadPoiData: loadPoiData,
    write: write,
    timer: timer,
    loadPois: loadPois,
    loadBeacons: loadBeacons
  };

  AR.context.clickBehavior = AR.CONST.CLICK_BEHAVIOR.TOUCH_DOWN;
  AR.context.scene.cullingDistance = AR.context.scene.maxScalingDistance = 250;
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
    console.log("Process time", (stop - start) / 1000);
  }

  function loadPois(pois) {
    pois.forEach(function (data) {
      var poi = new POI(data);
      World.pois[poi.id] = poi;
    });
    console.log(World.pois);
  }

  function loadBeacons(beacons) {
    var start = Date.now();
    beacons.forEach(function (data) {
      World.beacons.push(new Beacon(data));
    });
    World.timer(start);
    console.log(World.beacons);
  }
}
