/**
 * Created by Mathias on 29.03.2016.
 */
(function() {
  'use strict';

  angular
    .module('app')
    .controller('EncyclopediaCtrl', EncyclopediaCtrl);

  function EncyclopediaCtrl(encyclopediaData, $scope, $ionicTabsDelegate, $log) {
    var ctrl = this;

    ctrl.encyclopedia = encyclopediaData;
    $log.log(ctrl.encyclopedia);

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
  }
})();
