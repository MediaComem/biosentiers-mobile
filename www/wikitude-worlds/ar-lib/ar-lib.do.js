/**
 * Created by Mathias on 02.05.2016.
 */
(function () {
  'use strict';

  angular
    .module('ARLib')
    .service('Do', executer);

  function executer() {
    this.action = function (name, opt) {
      name !== 'showPos' && console.log('Do action :', name, 'with opt :', opt);
      var dest = "architectsdk://" + name;
      document.location = opt ? dest + "?" + angular.toJson(opt) : dest;
    }
  }
})();
