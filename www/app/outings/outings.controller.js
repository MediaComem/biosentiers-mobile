/**
 * Created by Mathias on 29.03.2016.
 */
(function () {
  'use strict';

  angular
    .module('app')
    .controller('OutingsCtrl', OutingsCtrl);

  function OutingsCtrl(outingsData, $scope, $ionicTabsDelegate) {
    var ctrl = this;

    ctrl.outings = outingsData;
    console.log(ctrl.outings);

    $scope.goForward = function () {
        var selected = $ionicTabsDelegate.selectedIndex();
        if (selected != -1) {
            $ionicTabsDelegate.select(selected + 1);
        }
    }

    $scope.goBack = function () {
        var selected = $ionicTabsDelegate.selectedIndex();
        if (selected != -1 && selected != 0) {
            $ionicTabsDelegate.select(selected - 1);
        }
    }

  }
})();
