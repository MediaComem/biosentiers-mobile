/**
 * Created by Mathias on 02.05.2016.
 */
angular
  .module('ar')
  .run(run);

function run(Do, $ionicLoading, $log, POI, POIData, $rootScope, UserLocation) {
  World = {
    startup    : true,
    poiData    : null,
    loadPoiData: loadPoiData,
    write      : write,
    //loadBeacons : loadBeacons,
    loadPoints : POIData.setData,
    showLoading: showLoading,
    hideLoading: $ionicLoading.hide,
    updateDeviceOrientation: function(updates) {
      $rootScope.$emit('orientation:changed', updates);
    }
  };

  /*
   * AR context configuration
   */
  AR.context.clickBehavior = AR.CONST.CLICK_BEHAVIOR.TOUCH_DOWN;
  AR.context.scene.cullingDistance = 250;
  AR.context.scene.maxScalingDistance = 500;
  AR.context.scene.minScalingDistance = 7;
  AR.context.scene.scalingFactor = 0.01;
  AR.context.onScreenClick = onScreenClick;
  AR.context.onLocationChanged = onLocationChanged;

  $rootScope.$on('filters:changed', onFiltersChanged);

  Do.action('open');

  ////////////////////

  function onScreenClick() {
    console.log('screen clicked', World);
  }

  function onLocationChanged(lat, lon, alt) {
    if (World.startup) {
      Do.action('toast', {message: 'Localisé !'});
    }
    UserLocation.update(lon, lat, alt);
    $rootScope.$emit('user:located');
    if (World.startup || UserLocation.movingDistance() > 20) {
      $log.debug('New user location detected');
      UserLocation.backupCurrent();
      POI.updateAr();
      World.startup = false;
    }
    console.log(UserLocation.debug());
  }

  function onFiltersChanged() {
    POI.updateAr();
  }

  function loadPoiData(data, properties) {
    console.log('setting the poi data');
    World.poiData = data;
    $rootScope.$emit('marker:loaded', properties);
  }

  function write(message) {
    $log.debug("World writes", message);
  }

  //function loadBeacons(beacons) {
  //  World.timer.start('loadbeacons');
  //  Beacon.loadStock(beacons);
  //  World.timer.loadbeacons.stop("Loading Beacons");
  //  console.log(Beacon.stock, Beacon.nearest);
  //}

  //function loadPoints(points) {
  //  console.log(points);
  //  World.timer.start('loadpois');
  //  POI.setRawStock(points);
  //  World.timer.loadpois.stop();
  //  console.log(POI.stock.raw);
  //}

  function showLoading(message) {
    return $ionicLoading.show({template: message});
  }
}
