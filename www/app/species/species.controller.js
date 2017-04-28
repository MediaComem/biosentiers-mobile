/**
 * Created by Mathias on 29.03.2016.
 */
(function() {
  'use strict';

  angular
    .module('app')
    .controller('SpeciesCtrl', SpeciesCtrl);

  function SpeciesCtrl(speciesData, $scope, $ionicTabsDelegate) {
    var ctrl = this;

    ctrl.species = speciesData;
    console.log(ctrl.species);

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
