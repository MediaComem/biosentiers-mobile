/**
 * Created by Mathias on 29.03.2016.
 */
(function() {
  'use strict';

  angular
    .module('app')
    .controller('OutingsCtrl', OutingsCtrl);

  function OutingsCtrl(outingsData, $scope, $ionicTabsDelegate) {
    var ctrl = this;
    // outings.loading = true;
    console.log('outingsData', outingsData);
    ctrl.outings = outingsData;

    $scope.goForward = function() {
      var selected = $ionicTabsDelegate.selectedIndex();
      if (selected != -1) {
        $ionicTabsDelegate.select(selected + 1);
      }
    };

    $scope.goBack = function() {
      var selected = $ionicTabsDelegate.selectedIndex();
      if (selected != -1 && selected != 0) {
        $ionicTabsDelegate.select(selected - 1);
      }
    };

    ////////////////////

    function loadAll() {

    }

    function loadPending() {

    }

    function loadOngoing() {

    }

    function loadFinished() {

    }

  }
})();
