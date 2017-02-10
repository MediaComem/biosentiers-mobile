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
    // Application modules.
    'activity-tracker-module',
    'auth-module',
    'bio-db-module',
    'poi-module',
    'map-icons-module',
    'outings-module',
    'seen-pois-data-module',
    'species-modules',
    'qr-module',
    'timers-module',
    'trans-module',
    'world-actions-module'
    // 'arDirectives'
  ]);
})();
