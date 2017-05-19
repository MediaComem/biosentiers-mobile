/**
 * Created by Mathias Oberson on 08.05.2017.
 */
(function() {
  'use strict';
  angular
    .module('trans-module')
    .filter('periodToMonth', periodToMonthFn);

  function periodToMonthFn() {
    var convert = {
      fr: {
        1 : 'janvier',
        2 : 'février',
        3 : 'mars',
        4 : 'avril',
        5 : 'mai',
        6 : 'juin',
        7 : 'juillet',
        8 : 'août',
        9 : 'septembre',
        10: 'octobre',
        11: 'novembre',
        12: 'decembre'
      }
    };

    var locale = 'fr';

    return function(input) {
      return convert[locale].hasOwnProperty(input) ? convert[locale][input] : '';
    }
  }
})();
