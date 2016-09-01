/**
 * Created by Mathias on 25.08.2016.
 */
(function () {
  'use strict';

  angular
    .module('debug-stats')
    .directive('debugStats', DebugStatsDirective)
    .controller('StatsCtrl', StatsCtrl);

  function DebugStatsDirective() {
    return {
      restrict    : 'E',
      replace     : true,
      controller  : 'StatsCtrl',
      controllerAs: 'stats',
      templateUrl : 'debug-stats/debug-stats.html'
    };
  }

  function StatsCtrl($log, POI) {
    var ctrl = this;

    ctrl.plus = 0;
    ctrl.moins = 0;
    ctrl.total = 0;

    POI.poisChangeObs.subscribe(function(changes) {
      $log.debug('Updating stats', changes.shown.length, changes.hidden.length, changes.visible.length);
      ctrl.plus = changes.shown.length;
      ctrl.moins = changes.hidden.length;
      ctrl.total = changes.visible.length;
    });
  }
})();
