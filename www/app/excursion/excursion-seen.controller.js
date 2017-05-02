/**
 * Created by Mathias Oberson on 10.02.2017.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .controller('ExcursionSeenCtrl', ExcursionSeenCtrl);

  function ExcursionSeenCtrl(excursionData, seenPois) {
    var excursionSeen = this;

    console.log(seenPois);

    excursionSeen.excursion = excursionData;
    excursionSeen.seenPois = seenPois;
  }
})();