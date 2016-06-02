/**
 * Created by Mathias on 02.05.2016.
 */
angular
  .module('ar')
  .run(run);

function run(Do, POI, Beacon, $rootScope, $ionicLoading) {
  var tStart, tStop;

  World = {
    userCoord  : null,
    poiData    : null,
    timer      : {
      start: start
    },
    loadPoiData: loadPoiData,
    write      : write,
    loadBeacons: loadBeacons,
    loadPois   : loadPois,
    showLoading: showLoading,
    hideLoading: $ionicLoading.hide
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

  function onLocationChanged(lat, lon, alt) {
    World.hideLoading();
    //console.log('coord', lat, lon, alt, acc);
    World.userCoord = {lat: lat, lon: lon, alt: alt};
    Do.action('showPos', World.userCoord);
    console.log('onLoactionChanged');
    // Devrait ne s'exécuter qu'une fois au lancement de la vue AR, lorsqu'aucune balise n'est active.
    World.timer.start('getnearest');
    if (!Beacon.nearest && Beacon.stock.length > 0) Beacon.activateNearest();
    World.timer.getnearest.stop("Getting the nearest beacon");
    console.log('Is user in the beacon\'s area ?', Beacon.nearest.canDetectUser(World.userCoord));
  }

  function loadPoiData(data) {
    console.log('setting the poi data');
    World.poiData = data;
    $rootScope.$emit('marker:loaded');
  }

  function write(message) {
    console.log("World writes", message);
  }

  function loadBeacons(beacons) {
    World.timer.start('loadbeacons');
    Beacon.loadStock(beacons);
    World.timer.loadbeacons.stop("Loading Beacons");
    console.log(Beacon.stock, Beacon.nearest);
  }

  function loadPois(pois) {
    World.timer.start('loadpois');
    POI.loadStock(pois);
    World.timer.loadpois.stop();
    console.log(POI.stock);
  }

  function showLoading(message) {
    return $ionicLoading.show({template: message});
  }

  function start(name) {
    World.timer[name] = {
      name : name,
      value: Date.now(),
      stop : function stop(message) {
        console.log(this);
        tStop = Date.now();
        console.log(message ? message : "Process time", (tStop - this.value) / 1000);
        delete World.timer[this.name];
      }
    };
  }
}
