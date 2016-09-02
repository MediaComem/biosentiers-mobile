/**
 * Created by Mathias on 02.05.2016.
 */
(function () {
  'use strict';

  angular
    .module('app-actions')
    .factory('AppActions', AppActionsService);

  function AppActionsService($log) {

    var service = {};

    service.execute = execute;

    return service;

    function execute(name, options) {
      $log.debug('Executing app action ' + name + ' with options ' + angular.toJson(options));
      var dest = "architectsdk://" + name;
      document.location = options ? dest + "?" + angular.toJson(options) : dest;
    }
  }
})();
