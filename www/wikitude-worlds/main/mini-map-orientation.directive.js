(function() {
  'use strict';

  /**
   * Defines the <map-orientation /> directive used to display and rotate
   * the heading arrow around the minimap.
   */
  angular
    .module('ar')
    .directive('miniMapOrientation', MiniMapOrientationDirective)
    .controller('MiniMapOrientationCtrl', MiniMapOrientationCtrl);

  function MiniMapOrientationDirective($log) {
    return {
      restrict: 'E',
      replace: true,
      controller: 'MiniMapOrientationCtrl',
      templateUrl: 'mini-map-orientation.html',
      link: linkMiniMapOrientationDirective
    };
  }

  function MiniMapOrientationCtrl($log, $rootScope, $scope) {

    var unbind = $rootScope.$on('orientation:changed', function(event, updates) {
      $scope.setOrientation(updates.trueHeading);
    });

    $scope.$on('$destroy', unbind);
  }

  function linkMiniMapOrientationDirective(scope, elem, attrs) {

    var $elem = $(elem),
        currentOrientation = 0; // Keep track of the current orientation.

    scope.setOrientation = setOrientation;

    /**
     * Rotates the directive element to the specified orientation.
     *
     * The orientation is a heading from 0 to 360°. This method will
     * perform the rotation clockwise or counter-clockwise, whichever
     * represents the shortest angle delta.
     *
     * It will also avoid a full rotation when the value wraps over zero
     * (e.g. a rotation from 359 degrees to 3 degrees should be a 4-degree
     * clockwise rotation, not a 355-degree counter-clockwise rotation).
     */
    function setOrientation(orientation) {

      // Stop already running rotation animation (if any).
      $elem.stop();

      var targetAngle = orientation, // Target orientation.
          rawDelta = targetAngle - currentOrientation, // Delta from the current orientation to the target orientation.
          effectiveDelta;

      if (rawDelta > 180) {
        // The delta is greater than 180 degrees. For exapmle, the current orientation is 20 degrees and the
        // target orientation is 320 degrees, making the delta 300. In this case, it is better to rotate
        // counter-clockwise by 60 degrees.
        targetAngle = targetAngle - 360; // Convert 320° to -40°, changing the effective rotation to 20° -> -40°.
        effectiveDelta = currentOrientation - targetAngle; // The effective delta is 60°.
      } else if (rawDelta < -180) {
        // The delta is greater than -180 degrees. For example, the current orientation is 350 degrees and the
        // target orientation is 30 degrees, making the delta -330. In this case, it is better to rotate
        // clockwise by 40 degrees.
        targetAngle = 360 + targetAngle; // Convert 30° to 390°, changing the effective rotation to 350° -> 390°.
        effectiveDelta = targetAngle - currentOrientation; // The effective delta is 40°.
      } else {
        // If the delta is smaller than 180 (positive or negative), leave it alone.
        effectiveDelta = Math.abs(rawDelta);
      }

      // Perform the rotation animation with a number of steps equal to 20 times the number of degrees to rotate.
      var steps = Math.ceil(effectiveDelta * 20);

      // Perform the animation with jQuery.
      $({ deg: currentOrientation }).animate({ deg: targetAngle }, {
        duration: steps,
        step: function(now) {

          // Update the current orientation.
          // Make sure that it is between 0 and 360 (as the CSS rotation angle can be negative or greater than 360).
          if (now > 360) {
            currentOrientation = now - 360;
          } else if (now < 0) {
            currentOrientation = 360 + now;
          } else {
            currentOrientation = now;
          }

          // Apply the current rotation with CSS.
          var rotation = 'rotate(' + now + 'deg)';
          $elem.css({
            '-moz-transform': rotation,
            '-webkit-transform': rotation,
            '-o-transform': rotation,
            '-ms-transform': rotation
          });
        }
      });
    };
  }

})();
