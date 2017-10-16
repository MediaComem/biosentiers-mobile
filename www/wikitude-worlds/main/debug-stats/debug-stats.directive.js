/**
 * Created by Mathias on 25.08.2016.
 */
(function() {
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

  function StatsCtrl(ArView, $log) {
    var TAG   = "[StatsCtrl] ",
        stats = this;

    stats.plus = 0;
    stats.moins = 0;
    stats.total = 0;

    ArView.poisChangeObs.subscribe(function(changes) {
      $log.debug(TAG + 'Updating stats', changes.shown.length, changes.hidden.length, changes.visible.length);
      stats.plus = changes.shown.length;
      stats.moins = changes.hidden.length;
      stats.total = changes.visible.length;
    });
  }
})();
