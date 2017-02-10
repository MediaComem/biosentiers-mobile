/**
 * Created by Mathias Oberson on 08.02.2017.
 */
(function() {
  'use strict';
  angular
    .module('trans-module')
    .filter('status', status);

  function status() {
    return function(input) {
      switch (input) {
        case 'pending':
          return 'En attente';
        case 'ongoing' :
          return 'En cours';
        case 'finished':
          return 'Terminée';
        default:
          return '';
      }
    }
  }
})();