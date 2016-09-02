/**
 * Created by Mathias
 * This is the main app module that is dependent upon all the other modules.
 */
(function () {
  'use strict';

  angular.module('ar', [
    // Third-party modules.
    'ionic',
    'TurfModule',
    'leaflet-directive',
    'ngCordova',
    // Application modules.
    'app-actions',
    'ar-view',
    'arDirectives',
    'big-map',
    'big-map-modal',
    'debug-position-modal',
    'debug-stats',
    'filters-modal',
    'icons',
    'mini-map',
    'mini-map-orientation',
    'modals',
    'outing',
    'timers',
    'world'
  ]);
})();
