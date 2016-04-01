/**
 * Created by Mathias on 01.04.2016.
 */
(function () {
  'use strict';

  angular
    .module('WikitudeModule')
    .service('WikitudeFunctions', WikitudeFunctions);

  function WikitudeFunctions() {
    this.function1 = function1;
    this.function2 = function2;

    ////////////////////

    function function1(a) {
      console.log('function1', a);
    }

    function function2() {
      console.log('function2');
    }
  }
})();
