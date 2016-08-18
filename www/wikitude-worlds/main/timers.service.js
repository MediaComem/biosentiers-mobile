(function() {
  angular
    .module('ar')
    .factory('Timers', TimersService);

  function TimersService($log) {

    var service = {
      start: function() {

        var startDate = new Date();

        return {
          stop: function(message) {
            var duration = new Date().getTime() - startDate.getTime();
            $log.debug(message ? message : "Processing time", (duration / 1000) + 's');
          }
        };
      },

      time: function(message, func) {
        var timer = service.start();
        var result = func();
        timer.stop(message);
        return result;
      }
    };

    return service;
  }
})();
