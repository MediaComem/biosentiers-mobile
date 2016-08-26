/**
 * Created by Mathias on 25.08.2016.
 */
(function () {
  'use strict';

  angular
    .module('debug-stats')
    .controller('StatsCtrl', StatsCtrl);

  function StatsCtrl($log, $rootScope) {
    var ctrl = this;

    ctrl.plus = 0;
    ctrl.moins = 0;
    ctrl.total = 0;

    $rootScope.$on('pois:changed', function (event, changes) {
      $log.debug('Updating stats', changes.shown.length, changes.hidden.length, changes.visible.length);
      ctrl.plus = changes.shown.length;
      ctrl.moins = changes.hidden.length;
      ctrl.total = changes.visible.length;
    });
  }
})();
