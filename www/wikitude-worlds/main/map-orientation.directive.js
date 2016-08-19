(function() {
  'use strict';

  angular
    .module('ar')
    .directive('mapOrientation', MapOrientationDirective)
    .controller('MapOrientationCtrl', MapOrientationCtrl);

  function MapOrientationDirective() {
    return {
      restrict: 'E',
      replace: true,
      controller: 'MapOrientationCtrl',
      templateUrl: 'map-orientation.template.html',
      link: function(scope, elem, attrs) {
        scope.setOrientation = function(value) {
          var r = 'rotate(' + value + 'deg)';
          elem.css({
            '-moz-transform': r,
            '-webkit-transform': r,
            '-o-transform': r,
            '-ms-transform': r
          });
        };
      }
    };
  }

  function MapOrientationCtrl($log, $rootScope, $scope) {
    $rootScope.$on('orientation:changed', function(event, updates) {
      $log.debug('Orientation changed: ' + JSON.stringify(updates));
      $scope.setOrientation(updates.trueHeading);
    });
  }

})();
