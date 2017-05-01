/**
 * Created by Mathias Oberson on 01.05.2017.
 */
(function() {
  'use strict';
  angular.module('position-badge')
    .directive('positionBadge', PositionBadgeDirective)
    .controller('PositionBadgeCtrl', PositionBadgeCtrl);

  function PositionBadgeDirective() {
    return {
      restrict   : 'E',
      templateUrl: 'app/position-badge/position-badge.html',
      controller : 'PositionBadgeCtrl as posbadge',
      scope      : {
        state: '=',
        label: '='
      }
    }
  }

  function PositionBadgeCtrl($scope, $log) {
    $scope.label = $scope.label || 'always';
    var posbadge = this;
    var states = {
      searching: searchingState,
      success  : successState,
      error    : errorState,
      refresh  : refreshState
    };

    $scope.$watch('state', function(newValue, oldValue) {
      $log.log('Position Badge Watch - state', newValue, oldValue);
      states[newValue]();
    });

    function searchingState() {
      posbadge.data = {
        label  : {
          text   : "Localisation...",
          visible: true
        },
        spinner: true,
        success: false,
        error  : false,
        refresh: false
      }
    }

    function successState() {
      posbadge.data = {
        label  : {
          text   : "Localisé !",
          visible: true
        },
        spinner: false,
        success: true,
        error  : false,
        refresh: false
      }
    }

    function errorState() {
      posbadge.data = {
        label  : {
          text   : "Erreur de localisation...",
          visible: true
        },
        spinner: false,
        success: false,
        error  : true,
        refresh: false
      }
    }

    function refreshState() {
      posbadge.data = {
        label  : {
          text   : "Localiser",
          visible: true
        },
        spinner: false,
        success: false,
        error  : false,
        refresh: true
      }
    }
  }
})();