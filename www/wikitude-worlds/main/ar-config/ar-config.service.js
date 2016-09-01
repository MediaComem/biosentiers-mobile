/**
 * Created by Mathias on 25.08.2016.
 */
(function () {
  'use strict';

  angular
    .module('ar-config')
    .factory('ArConfig', ArConfig);

  function ArConfig(Do, $log, POI, $rootScope, UserLocation, World) {

    var service = {
      init: init
    };

    return service;

    ////////////////////

    function init() {
      AR.context.clickBehavior = AR.CONST.CLICK_BEHAVIOR.TOUCH_DOWN;
      AR.context.scene.cullingDistance = 250;
      AR.context.scene.maxScalingDistance = 500;
      AR.context.scene.minScalingDistance = 7;
      AR.context.scene.scalingFactor = 0.01;
      AR.context.onScreenClick = onScreenClick;
      AR.context.onLocationChanged = onLocationChanged;
    }

    function onScreenClick() {
      console.log('screen clicked', World);
    }

    function onLocationChanged(lat, lon, alt) {
      if (World.startup) {
        Do.action('toast', {message: 'Localisé !'});
      }
      UserLocation.update(lon, lat, alt);
      if (World.startup || UserLocation.movingDistance() > 20) {
        $log.debug('New user location detected');
        UserLocation.backupCurrent();
        POI.updateAr();
        World.startup = false;
      }
      console.log(UserLocation.debug());
    }
  }
})();
