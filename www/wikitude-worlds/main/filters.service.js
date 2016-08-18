(function() {
  angular
    .module('ar')
    .factory('Filters', FiltersService);

  function FiltersService($ionicModal, $log, POIData, $rootScope) {

    // Currently selected filters.
    // Update by calling `Filters.update(selected)`.
    var selected = {
      theme: null
    };

    var service = {

      // Available choices to use for filtering.
      themes: [],

      // Returns the currently selected filters.
      getSelected: function() {
        return _.cloneDeep(selected);
      },

      // Update currently selected filters:
      //
      //     Filters.update({
      //       theme: 'Some theme'
      //     });
      updateSelected: function(changes) {
        _.extend(selected, _.pick(changes || {}, 'theme'));
        $rootScope.$emit('filters:changed', selected);
      },

      // Filters points of interest using the currently selected filters.
      filterPois: function(pois) {

        var n = pois.length;

        if (selected.theme) {
          pois = _.filter(pois, matchBySelectedTheme);
        }

        $log.debug('Filters: ' + n + ' points of interest filtered to ' + pois.length + ' matching points with criteria ' + JSON.stringify(selected));

        return pois;
      },

      // Shows a modal dialog to configure filters.
      showModal: function($scope) {
        $log.debug('Showing filters modal');
        return $ionicModal.fromTemplateUrl('filters.modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        });
      }
    };

    // Update available chocies when the data changes.
    $rootScope.$on('poiData:changed', function() {
      service.themes = POIData.getThemes();
      $log.debug('Filters: available themes updated to ' + service.themes.join(', '));
    });

    function matchBySelectedTheme(poi) {
      return _.isObject(poi.properties) && poi.properties.theme_name == selected.theme;
    }

    return service;
  }
})();
