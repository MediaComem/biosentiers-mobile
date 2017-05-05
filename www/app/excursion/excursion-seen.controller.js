/**
 * Created by Mathias Oberson on 10.02.2017.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .controller('ExcursionSeenCtrl', ExcursionSeenCtrl);

  function ExcursionSeenCtrl(excursionData, seenPois, $log) {
    var excursionSeen = this;

    $log.log(seenPois);

    excursionSeen.excursion = excursionData;
    excursionSeen.seenPois = seenPois;
  }
})();