/**
 * Created by Mathias Oberson on 27.04.2017.
 */
(function() {
  'use strict';
  angular
    .module('trans-module')
    .filter('outingActionButton', outingActionButton);

  function outingActionButton() {
    var convert = {
      fr: {
        pending : "Démarrer",
        ongoing : 'Reprendre',
        finished: 'Compte-rendu'
      }
    };

    var locale = 'fr';

    return function(input) {
      return convert[locale].hasOwnProperty(input) ? convert[locale][input] : '';
    }
  }
})();