/**
 * Created by Mathias on 31.03.2016.
 */
(function () {
  'use strict';

  angular.module('app', [
    // Third-party modules.
    'ionic',
    'ionicitude-module',
    'lokijs',
    'leaflet-directive',
    'ngCordova',
    'TurfModule',
    // Application modules.
    'activity-tracker-module',
    'auth-module',
    'bio-db-module',
    'poi-module',
    'map-icons-module',
    'excursions-module',
    'excursions-list-menu',
    'poi-card-module',
    'position-badge',
    'seen-pois-data-module',
    'encyclopedia-module',
    'qr-module',
    'timers-module',
    'trans-module',
    'world-actions-module'
    // 'arDirectives'
  ]);
})();
