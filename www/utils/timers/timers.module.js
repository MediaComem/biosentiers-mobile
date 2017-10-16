(function() {
  'use strict';

  angular.module('timers-module', []);

  angular
    .module('timers-module')
    .factory('Timers', TimersService);

  function TimersService($log) {

    var TAG     = "[TimersService] ",
        service = {
          start: function() {

            var startDate = new Date();

            return {
              stop: function(action) {
                var duration = new Date().getTime() - startDate.getTime();
                $log.debug(TAG + 'Time' + (action ? ' to ' + action : '') + ':', (duration / 1000) + 's');
                return duration;
              }
            };
          },

          time: function(action, func) {
            var timer = service.start();
            var result = func();
            timer.stop(action);
            return result;
          }
        };

    return service;
  }
})();
