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
        showLabel: '@'
      }
    }
  }

  function PositionBadgeCtrl($scope, $log) {
    $log.log('PositionBadgeCtrl', $scope.showLabel);
    $scope.showLabel = $scope.showLabel || 'always';
    var posbadge = this;
    var states = {
      searching: {
        label: {
          text: "Localisation...",
          visible: true
        },
        action: searchingState
      },
      success  : {
        label: {
          text: "Localisé !",
          visible: true
        },
        action: successState
      },
      error    : {
        label: {
          text: "Erreur de localisation...",
          visible: true
        },
        action: errorState
      },
      refresh  : {
        label: {
          text: "Localiser",
          visible: true
        },
        action: refreshState
      }
    };

    $scope.$watch('state', function(newValue, oldValue) {
      $log.log('Position Badge Watch - state', newValue, oldValue);
      if (typeof newValue === "undefined") throw new Error("Position Badge Directive - undefined state value");
      $scope.showLabel === 'never' && hideLabel(newValue);
      states[newValue].action();
      $scope.showLabel === 'once' && hideLabel(newValue);
    });

    function hideLabel(state) {
      states[state].label.visible = false;
    }

    function searchingState() {
      posbadge.data = {
        label  : angular.copy(states.searching.label),
        spinner: true,
        success: false,
        error  : false,
        refresh: false
      }
    }

    function successState() {
      posbadge.data = {
        label  : angular.copy(states.success.label),
        spinner: false,
        success: true,
        error  : false,
        refresh: false
      }
    }

    function errorState() {
      posbadge.data = {
        label  : angular.copy(states.error.label),
        spinner: false,
        success: false,
        error  : true,
        refresh: false
      }
    }

    function refreshState() {
      posbadge.data = {
        label  : angular.copy(states.refresh.label),
        spinner: false,
        success: false,
        error  : false,
        refresh: true
      }
    }
  }
})();