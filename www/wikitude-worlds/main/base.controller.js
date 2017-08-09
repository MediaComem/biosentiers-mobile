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

  function BaseCtrl(AppActions, ArView, Altitude, DebugLog, EndPopup, $ionicLoading, Modals, $log, Excursion, $scope, UserLocation, $timeout) {
    var TAG        = "[BaseCtrl] ",
        debugCount = 0,
        base       = this;

    // TODO : supprimer hors debug
    base.debugPositionClass = 'royal';
    base.logs = [];
    base.showDebug = false;
    base.locatingUser = true;
    base.manualEnding = false;

    base.closeAR = closeAR;
    base.showDebugModal = showDebugModal;
    base.showFiltersModal = showFiltersModal;
    base.finishExcursion = finishExcursion;
    base.manageDebugLog = manageDebugLog;

    $ionicLoading.show({
      template: "Recherche de votre position."
    });

    UserLocation.realObs.subscribe(function(position) {
      DebugLog.add('Real User Location Altitude ' + position.alt);
      if (position.alt === 0 || position.alt === Altitude.unknown) {
        base.altitude = 'Inconnue'
      } else {
        base.altitude = position.alt + 'm';
      }
      base.accuracy = position.acc;
      updateDebugPositionClass(position.acc);
    });

    UserLocation.realObs.subscribe(function() {
      $ionicLoading.hide();
    });

    Excursion.excursionChangeObs.subscribe(function(data) {
      // Excursion.excursionChangeObs.first().subscribe(function(data) {
      $timeout(function() {
        base.excursionName = data.name;
      })
    });

    Excursion.currentPoiChangeObs.subscribe(showPoiModal);

    ArView.activateManualEndingObs.subscribe(function() {
      base.manualEnding = true;
    });

    $scope.$on('modal.hidden', function(data) {
      $log.log(TAG + 'modal destroyed', data);
    });

    $scope.$on('modal.removed', function(data) {
      $log.log(TAG + 'modal removed', data);
    });

    ////////////////////

    // TODO : Supprimer hors debug
    function manageDebugLog() {
      if (base.showDebug) {
        base.showDebug = false;
        debugCount = 0;
      } else {
        debugCount += 1;
        $log.log(TAG + 'manageDebugLog', debugCount);
        if (debugCount === 7) {
          base.showDebug = true;
        }
      }
    }

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
      $log.debug(TAG + 'Closing the AR');
      AppActions.execute('close');
    }

    function finishExcursion() {
      EndPopup.manual().then(function(validated) {
        validated && AppActions.execute('finishExcursion', {qrId: Excursion.qrId});
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
