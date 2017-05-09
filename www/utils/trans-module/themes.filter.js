/**
 * Created by Mathias Oberson on 26.04.2017.
 */
(function() {
  'use strict';
  angular
    .module('trans-module')
    .filter('themes', themesFilter);

  function themesFilter() {
    var convert = {
      fr: {
        bird     : "Oiseaux",
        flower   : "Fleurs/Plantes",
        butterfly: "Papillons",
        tree     : "Arbres"
      }
    };

    var locale = 'fr';

    return function(input) {
      return convert[locale].hasOwnProperty(input) ? convert[locale][input] : '';
    }
  }
})();
