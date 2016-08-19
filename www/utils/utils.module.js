(function() {

  angular.module('utils', []);

  angular
    .module('utils')
    .factory('Timers', TimersService);

  function TimersService($log) {

    var service = {
      start: function() {

        var startDate = new Date();

        return {
          stop: function(action) {
            var duration = new Date().getTime() - startDate.getTime();
            $log.debug('Time' + (action ? ' to ' + action : '') + ':', (duration / 1000) + 's');
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
