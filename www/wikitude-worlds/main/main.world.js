/**
 * Created by Mathias on 02.05.2016.
 */
angular
  .module('ar')
  .run(run);

function run(Do, POI, Beacon, $rootScope, $ionicLoading, turf, UserLocation) {
  var tStop;

  World = {
    poiData     : null,
    timer       : {
      start: start
    },
    loadPoiData : loadPoiData,
    write       : write,
    //loadBeacons : loadBeacons,
    loadPoints  : POI.setRawStock,
    showLoading : showLoading,
    hideLoading : $ionicLoading.hide
  };

  AR.context.clickBehavior = AR.CONST.CLICK_BEHAVIOR.TOUCH_DOWN;
  AR.context.scene.cullingDistance = 250;
  AR.context.scene.maxScalingDistance = 500;
  AR.context.scene.minScalingDistance = 5;
  AR.context.scene.scalingFactor = 0.2;
  AR.context.onScreenClick = onScreenClick;
  AR.context.onLocationChanged = onLocationChanged;

  ////////////////////

  function onScreenClick() {
    console.log('screen clicked', World);
  }

  function onLocationChanged(lat, lon, alt) {
    // L'app doit charger les points si c'est la première mise à jour de position
    // Regarder aussi pourquoi elle ne charge pas les points quand on passe de Balise 2 à Balise 1
    UserLocation.update(lon, lat, alt);
    Do.action('toast', {message: UserLocation.current.literal()});
    console.log(UserLocation.movingDistance());
    if (UserLocation.movingDistance() > 20) POI.loadStock() && UserLocation.updateLast();
    console.log(UserLocation.current, UserLocation.last);
  }

  function loadPoiData(data) {
    console.log('setting the poi data');
    World.poiData = data;
    $rootScope.$emit('marker:loaded');
  }

  function write(message) {
    console.log("World writes", message);
  }

  //function loadBeacons(beacons) {
  //  World.timer.start('loadbeacons');
  //  Beacon.loadStock(beacons);
  //  World.timer.loadbeacons.stop("Loading Beacons");
  //  console.log(Beacon.stock, Beacon.nearest);
  //}

  function loadPoints(points) {
    console.log(points);
    World.timer.start('loadpois');
    POI.setRawStock(points);
    World.timer.loadpois.stop();
    console.log(POI.stock.raw);
  }

  function showLoading(message) {
    return $ionicLoading.show({template: message});
  }

  function start(name) {
    World.timer[name] = {
      name : name,
      value: Date.now(),
      stop : function stop(message) {
        tStop = Date.now();
        console.log(message ? message : "Process time", (tStop - this.value) / 1000);
        delete World.timer[this.name];
      }
    };
  }
}
