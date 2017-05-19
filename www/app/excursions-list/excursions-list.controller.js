/**
 * Created by Mathias Oberson on 18.05.2017.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .controller('ExcursionsListCtrl', ExcursionsListCtrlFn);

  function ExcursionsListCtrlFn(Excursions, $log) {
    var list = this;

    Excursions.getStats()
      .then(function(stats) {
        $log.log('ExcursionsListCtrl:stats', stats);
        list.stats = stats;
      });
  }
})();
