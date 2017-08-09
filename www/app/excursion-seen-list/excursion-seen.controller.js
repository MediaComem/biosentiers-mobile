/**
 * Created by Mathias Oberson on 10.02.2017.
 */
(function() {
  'use strict';
  angular
    .module('app')
    .controller('ExcursionSeenCtrl', ExcursionSeenCtrl);

  function ExcursionSeenCtrl(excursionData, DbSeenPois, $log) {
    var TAG           = "[ExcursionSeenCtrl] ",
        excursionSeen = this;
    excursionSeen.excursion = excursionData;
    excursionSeen.getIconPathForTheme = getIconPathForTheme;

    DbSeenPois
      .getAll(excursionSeen.excursion.qrId)
      .then(function(data) {
        $log.log(TAG + 'seenPois', data);
        excursionSeen.seenPois = data;
      });

    ////////////////////

    function getIconPathForTheme(theme) {
      var path = './wikitude-worlds/main/assets/icons/' + theme + '.png';
      $log.log(TAG + 'getIconPathForTheme:path', path);
      return path;
    }
  }
})();
