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

  function BaseCtrl(AppActions, ArView, DebugLog, EndPopup, Modals, $log, Excursion, $scope, UserLocation) {
    var base = this;

    // TODO : supprimer hors debug
    base.debugPositionClass = 'royal';
    base.logs = [];
    base.showDebugLog = false;
    var debugCount = 0;
    base.manageDebugLog = function() {
      if (base.showDebugLog) {
        base.showDebugLog = false;
        debugCount = 0;
      } else {
        debugCount += 1;
        $log.log('BaseCtrl:manageDebugLog', debugCount);
        if (debugCount === 7) {
          base.showDebugLog = true;
        }
      }
    };

    base.manualEnding = false;
    base.closeAR = closeAR;
    base.showDebugModal = showDebugModal;
    base.showFiltersModal = showFiltersModal;
    base.finishExcursion = finishExcursion;

    UserLocation.realObs.subscribe(function(position) {
      DebugLog.add('Real User Location Altitude ' + position.alt);
      if (position.alt === 0 || position.alt === AR.CONST.UNKNOWN_ALTITUDE) {
        base.altitude = 'Inconnue'
      } else {
        base.altitude = position.alt + 'm';
      }
      base.accuracy = position.acc;
      updateDebugPositionClass(position.acc);
    });

    Excursion.currentPoiChangeObs.subscribe(showPoiModal);

    ArView.activateManualEndingObs.subscribe(function() {
      base.manualEnding = true;
    });

    ArView.updateArPoisAltitudeObs.subscribe(function() {
      DebugLog.add("Altitude updated");
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
