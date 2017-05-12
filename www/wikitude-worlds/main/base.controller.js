(function() {
  angular
    .module('ar')
    .filter('accValueToText', accValueToText)
    .controller('BaseCtrl', BaseCtrl);

  // TODO : Ce filtre peut être supprimé ou modifié en production
  function accValueToText() {
    var text = {
      1: 'LOW',
      2: 'MEDIUM',
      3: 'HIGH'
    };

    return function(input) {
      return text[input];
    }
  }

  function BaseCtrl(AppActions, ArView, EndPopup, Modals, $log, Excursion, $scope, UserLocation) {
    var base = this;

    // TODO : supprimer hors debug
    base.debugPositionClass = 'royal';
    base.hasReachedEnd = false;
    base.closeAR = closeAR;
    base.showDebugModal = showDebugModal;
    base.showFiltersModal = showFiltersModal;
    base.finishExcursion = finishExcursion;

    UserLocation.realObs.subscribe(function(position) {
      base.altitude = position.alt;
      base.accuracy = position.acc;
      updateDebugPositionClass(position.acc);
    });

    Excursion.currentPoiChangeObs.subscribe(showPoiModal);

    ArView.excursionEndReachedObs.subscribe(function() {
      base.hasReachedEnd = true;
    });

    ////////////////////

    // TODO : Supprimer hors debug
    function updateDebugPositionClass(acc) {
      var classes = {
        1: 'assertive',
        2: 'energized',
        3: 'balanced'
      };

      if (classes.hasOwnProperty(acc)) {
        base.debugPositionClass = classes[acc];
      }
    }

    function closeAR() {
      $log.debug('Closing the AR');
      AppActions.execute('close');
    }

    function finishExcursion() {
      EndPopup.manual().then(function(validated) {
        validated && AppActions.execute('finishExcursion', {excursionId: Excursion.id});
      });
    }

    function showDebugModal() {
      Modals.showDebugPosition($scope);
    }

    function showFiltersModal() {
      Modals.showFilters($scope);
    }

    function showPoiModal() {
      Modals.showPoi($scope);
    }
  }
})();
