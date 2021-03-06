/**
 * Created by Mathias on 31.03.2016.
 */
(function () {
  'use strict';

  angular.module('app', [
    // Third-party modules.
    'angular-jwt',
    'ionic',
    'ionicitude-module',
    'lokijs',
    'leaflet-directive',
    'ngCordova',
    'TurfModule',
    // Application modules.
    'activity-tracker-module',
    'auth-module',
    'bio-api-module',
    'connect-module',
    'db-bio-module',
    'event-log-module',
    'excursions-list-menu',
    'excursions-list-settings',
    'excursion-context-menus',
    'installation-id-module',
    'map-icons-module',
    'poi-module',
    'poi-card-module',
    'position-badge',
    'encyclopedia-module',
    'qr-module',
    'timers-module',
    'trans-module',
    'uuid-module',
    'world-actions-module'
    // 'arDirectives'
  ]);
})();
