(function() {
  'use strict';
  angular
    .module('uuid-module', [])
    .factory('uuid', uuid);

  function uuid() {
    return {
      gen: function() {
        return b();
      }
    };

    /**
     * Returns a random v4 UUID of the form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx,
     * where each x is replaced with a random hexadecimal digit from 0 to f,
     * and y is replaced with a random hexadecimal digit from 8 to b.
     * @author Jed Schmidt (https://github.com/jed)
     * @link https://gist.github.com/jed/982883
     * @param a
     * @return {string}
     */
    function b(a) {return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b)}
  }
})();
