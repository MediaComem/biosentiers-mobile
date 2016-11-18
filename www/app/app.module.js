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
    'poi',
    'leaflet-directive',
    'map-icons',
    'OutingsModule',
    'SpeciesModule',
    'QRModule',
    'timers',
    'world-actions'
    // 'arDirectives'
  ]);
})();
