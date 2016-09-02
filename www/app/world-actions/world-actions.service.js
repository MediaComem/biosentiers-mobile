(function () {
  'use strict';

  angular
    .module('world-actions')
    .factory('WorldActions', WorldActionsService);

  function WorldActionsService(Ionicitude) {

    var service = {
      execute: execute
    };

    return service;

    ////////////////////

    function execute(name) {
      var args = _.map(Array.prototype.slice.call(arguments, 1), angular.toJson);
      Ionicitude.callJavaScript('World.' + name + '(' + args.join(', ') + ')');
    }
  }
})();
