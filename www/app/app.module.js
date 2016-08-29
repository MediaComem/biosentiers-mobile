/**
 * Created by Mathias on 31.03.2016.
 */
(function () {
  'use strict';

  angular.module('app', [
    'ionic',
    'ngCordova',
    'IonicitudeModule',
    'AuthModule',
    'QRModule',
    'OutingsModule', // SHC : pour le service contenant la liste des sorties
    'POIModule',
    'leaflet-directive',
    'timers'
    // 'arDirectives'
  ]);

})();
