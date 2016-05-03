/**
 * Created by Mathias on 29.03.2016.
 */
(function () {
  'use strict';

  angular
    .module('app')
    .controller('OutingsCtrl', OutingCtrl);

  function OutingCtrl($scope) {
    $scope.outings = [
      {title: 'Reggae', id: 1},
      {title: 'Chill', id: 2},
      {title: 'Dubstep', id: 3},
      {title: 'Indie', id: 4},
      {title: 'Rap', id: 5},
      {title: 'Cowbell', id: 6}
    ];
  }
})();
