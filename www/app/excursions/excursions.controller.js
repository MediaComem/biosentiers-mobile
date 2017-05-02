/**
 * Created by Mathias on 29.03.2016.
 */
(function() {
  'use strict';

  angular
    .module('app')
    .controller('ExcursionsCtrl', ExcursionsCtrl);

  function ExcursionsCtrl(excursionsData, $scope, $ionicTabsDelegate) {
    var excursions = this;
    // excursions.loading = true;
    console.log('excursionsData', excursionsData);
    excursions.data = excursionsData;

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
