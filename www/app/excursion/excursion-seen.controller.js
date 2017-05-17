/**
 * Created by Mathias Oberson on 10.02.2017.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .controller('ExcursionSeenCtrl', ExcursionSeenCtrl);

  function ExcursionSeenCtrl(excursionData, SeenPoisData, $log) {
    var excursionSeen = this;
    excursionSeen.excursion = excursionData;

    SeenPoisData
      .getAll(excursionSeen.excursion.id)
      .then(function(data) {
        $log.log('ExcursionSeenCtrl:seenPois', data);
        excursionSeen.seenPois = data;
      });
  }
})();
