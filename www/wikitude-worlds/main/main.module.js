/**
 * Created by Mathias
 * This is the main app module that is dependent upon all the other modules.
 */
(function () {
  'use strict';

  angular.module('ar', [
    'ionic',
    'arDirectives',
    'ARLib',
    'TurfModule',
    'leaflet-directive',
    'ngCordova',
    'utils',
    'debug-position-modal',
    'debug-stats',
    'filters',
    'mini-map',
    'mini-map-orientation',
    'world',
    'big-map-modal',
    'ar-config'
  ]);
})();
