/**
 * Created by Mathias on 29.03.2016.
 */
angular
  .module('app')
  .controller('AppCtrl', AppCtrl);

function AppCtrl($scope, ARService) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.launchAR = function () {
    console.log('launching AR');
  }
}
