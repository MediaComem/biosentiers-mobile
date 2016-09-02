/**
 * Created by Mathias on 02.05.2016.
 */
(function () {
  'use strict';

  angular
    .module('app-actions')
    .factory('AppActions', AppActionsService);

  function AppActionsService() {

    var service = {};

    service.execute = execute;

    return service;

    function execute(name, opt) {
      name !== 'showPos' && console.log('Execute app action :', name, 'with opt :', opt);
      var dest = "architectsdk://" + name;
      document.location = opt ? dest + "?" + angular.toJson(opt) : dest;
    }
  }
})();
