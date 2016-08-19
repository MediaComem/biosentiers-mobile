/**
 * Created by Mathias on 02.05.2016.
 */
angular
  .module('ar')
  .run(run);

function run(Do, $ionicLoading, POI, POIData, $rootScope, UserLocation) {
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

  AR.context.clickBehavior = AR.CONST.CLICK_BEHAVIOR.TOUCH_DOWN;
  AR.context.scene.cullingDistance = 250;
  AR.context.scene.maxScalingDistance = 500;
  AR.context.scene.minScalingDistance = 7;
  AR.context.scene.scalingFactor = 0.01;
  AR.context.onScreenClick = onScreenClick;
  AR.context.onLocationChanged = onLocationChanged;

  AR.radar.container = document.getElementById("radarContainer");
  // set the back-ground image for the radar
  AR.radar.background = new AR.ImageResource("assets/radar_bg_transparent.png");
  // set the north-indicator image for the radar (not necessary if you don't want to display a north-indicator)
  AR.radar.northIndicator.image = new AR.ImageResource("assets/radar_north.png");
  // center of north indicator and radar-points in the radar asset, usually center of radar is in the exact middle of the bakground, meaning 50% X and 50% Y axis --> 0.5 for centerX/centerY
  AR.radar.centerX = 0.5;
  AR.radar.centerY = 0.5;
  AR.radar.radius = 0.3;
  AR.radar.northIndicator.radius = 0.0;
  AR.radar.maxDistance = 50;
  AR.radar.enabled = true;

  $rootScope.$on('filters:changed', onFiltersChanged);

  //Do.action('open');

  ////////////////////

  function onScreenClick() {
    console.log('screen clicked', World);
  }

  function onLocationChanged(lat, lon, alt) {
    console.log('located ?', !World.startup);
    if (World.startup) {
      Do.action('toast', {message: 'Localisé !'});
    }
    UserLocation.update(lon, lat, alt);
    if (World.startup || UserLocation.movingDistance() > 20) {
      UserLocation.backupCurrent();
      POI.updateAr();
      World.startup = false;
      console.log(UserLocation.debug());
    }
    $rootScope.$emit('user:located');
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
    console.log("World writes", message);
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
