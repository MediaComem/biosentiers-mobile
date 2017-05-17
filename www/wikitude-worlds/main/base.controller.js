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

  function BaseCtrl(AppActions, ArView, Altitude, DebugLog, EndPopup, Modals, $log, Excursion, $scope, UserLocation) {
    var base = this;

    // TODO : supprimer hors debug
    base.debugPositionClass = 'royal';
    base.logs = [];
    base.showDebug = false;
    var debugCount = 0;
    base.manageDebugLog = function() {
      if (base.showDebug) {
        base.showDebug = false;
        debugCount = 0;
      } else {
        debugCount += 1;
        $log.log('BaseCtrl:manageDebugLog', debugCount);
        if (debugCount === 7) {
          base.showDebug = true;
        }
      }
    };
    base.upArPois = function() {
      // _.each(ArView.arPointsById, function(arPoi) {
      //   $log.log('upArPois:arPoi current altitude', arPoi.location.altitude);
      //   if (arPoi.location.altitude !== Altitude.unknown) {
      //     arPoi.location.altitude += 10;
      //     $log.log('upArPois:arPoi updated altitude', arPoi.location.altitude);
      //     DebugLog.add('Update')
      //   } else {
      //     DebugLog.add('POI with unknow altitude - update canceled')
      //   }
      // });
    };

    base.manualEnding = false;
    base.closeAR = closeAR;
    base.showDebugModal = showDebugModal;
    base.showFiltersModal = showFiltersModal;
    base.finishExcursion = finishExcursion;

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

    Excursion.excursionChangeObs.first().subscribe(function(data) {
      base.excursionName = data.name;
    });

    Excursion.currentPoiChangeObs.subscribe(showPoiModal);

    ArView.activateManualEndingObs.subscribe(function() {
      base.manualEnding = true;
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
