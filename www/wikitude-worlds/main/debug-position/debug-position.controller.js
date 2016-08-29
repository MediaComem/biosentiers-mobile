/**
 * Created by Mathias on 25.08.2016.
 */
(function () {
  'use strict';

  angular
    .module('debug-position')
    .controller('DebugCtrl', DebugCtrl);

  function DebugCtrl(Do, $scope) {
    var ctrl = this;

    ctrl.balises = function balises(num) {
      switch (num) {
        case 1:
          Do.action('setPosition', {lat: 46.781025850072695, lon: 6.641159078988079, alt: 431});
          break;
        case 2:
          Do.action('setPosition', {lat: 46.780397285829991, lon: 6.643032521127623, alt: 431});
          break;
        default:
          throw new TypeError('Numéro inconnu');
      }
      $scope.base.modal.hide();
    };

    ctrl.heig = function heig() {
      Do.action('setPosition', {lat: 46.781058, lon: 6.647179, alt: 431});
      $scope.base.modal.hide();
    };

    ctrl.plage = function plage() {
      Do.action('setPosition', {lat: 46.784083, lon: 6.652281, alt: 431});
      $scope.base.modal.hide();
    };

    ctrl.cheseaux = function cheseaux() {
      Do.action('setPosition', {lat: 46.779043, lon: 6.659222, alt: 448});
      $scope.base.modal.hide();
    };

    ctrl.champPittet = function champPittet() {
      Do.action('setPosition', {lat: 46.7837611642946, lon: 6.66567090924512, alt: 436.74});
      $scope.base.modal.hide();
    };

    ctrl.position = {};

    ctrl.custom = function custom() {
      console.log(ctrl.position);
      if (ctrl.position.hasOwnProperty('lat') && ctrl.position.hasOwnProperty('lon') && ctrl.position.hasOwnProperty('alt')) {
        Do.action('setPosition', {lat: ctrl.position.lat, lon: ctrl.position.lon, alt: ctrl.position.alt});
        $scope.base.modal.hide();
      } else {
        Do.action('toast', {message: "Des champs ne sont pas remplis"});
      }
    }
  }
})();
