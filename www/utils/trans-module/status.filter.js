/**
 * Created by Mathias Oberson on 08.02.2017.
 */
(function() {
  'use strict';
  angular
    .module('trans-module')
    .filter('status', statusFilter);

  function statusFilter($log) {
    var convert = {
      fr: {
        pending : "En attente",
        ongoing : 'En cours',
        finished: 'Terminée'
      }
    };

    var locale = 'fr';

    return function(input) {
      return convert[locale].hasOwnProperty(input) ? convert[locale][input] : '';
    }
  }
})();