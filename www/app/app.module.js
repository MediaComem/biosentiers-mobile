/**
 * Created by Mathias on 31.03.2016.
 */
(function () {
  'use strict';

  angular.module('app', [
    // Third-party modules.
    'ionic',
    'IonicitudeModule',
    'leaflet-directive',
    'ngCordova',
    // Application modules.
    'AuthModule',
    'icons',
    'OutingsModule',
    'POIModule',
    'QRModule',
    'timers'
    // 'arDirectives'
  ]);
})();
