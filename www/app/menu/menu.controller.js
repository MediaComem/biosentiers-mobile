/**
 * Created by Mathias on 29.03.2016.
 */
(function() {
  'use strict';

  angular
    .module('app')
    .controller('MenuCtrl', MenuCtrl);

  function MenuCtrl(ActivityTracker, EventLogFactory, $ionicSideMenuDelegate, $log, $scope) {
    var TAG        = "[MenuCtrl] ",
        menu       = this,
        debugCount = 0;

    $scope.$watch(function() { return $ionicSideMenuDelegate.getOpenRatio(); },
      function(ratio) { ratio === 1 && ActivityTracker(EventLogFactory.navigation.menuOpen()); }
    );

    menu.showDebug = false;
    menu.manageDebugLog = function() {
      if (menu.showDebug) {
        menu.showDebug = false;
        debugCount = 0;
      } else {
        debugCount += 1;
        $log.log(TAG + 'manageDebugLog', debugCount);
        if (debugCount === 7) {
          menu.showDebug = true;
        }
      }
    }
  }
})();
