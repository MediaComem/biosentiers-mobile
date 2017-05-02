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
      // templateUrl: 'app/position-badge/position-badge.html',
      template   : '<div class="position-badge"><div class="pos-icon"><ion-spinner icon="ripple" class="spinner-assertive" ng-if="posbadge.data.spinner"></ion-spinner><i class="icon ion-android-checkmark-circle balanced" ng-if="posbadge.data.success"></i> <i class="icon ion-android-cancel assertive" ng-if="posbadge.data.error"></i> <i class="icon ion-loop positive" ng-if="posbadge.data.refresh"></i></div><div class="pos-label" ng-if="posbadge.data.label.visible">{{ posbadge.data.label.text }}</div></div>',
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
      if (!newValue) throw new Error("Position Badge Directive - ");
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