/**
 * Created by Mathias on 02.05.2016.
 */
(function () {
  'use strict';

  angular
    .module('ARLib')
    .factory('Do', DoService);

  function DoService() {

    var service = {};

    service.action = action;

    return service;

    function action(name, opt) {
      name !== 'showPos' && console.log('Do action :', name, 'with opt :', opt);
      var dest = "architectsdk://" + name;
      document.location = opt ? dest + "?" + angular.toJson(opt) : dest;
    }
  }
})();
