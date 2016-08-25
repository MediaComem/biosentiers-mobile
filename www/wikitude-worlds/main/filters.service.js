(function() {
  'use strict';

  angular
    .module('ar')
    .factory('Filters', FiltersService);

  function FiltersService($ionicModal, $log, POIData, $rootScope) {

    // Currently selected filters.
    // Update by calling `Filters.update(selected)`.
    var selected = {
      themes: []
    };

    var service = {
      themes        : [], // Available choices to use for filtering.
      getSelected   : getSelected,
      updateSelected: updateSelected,
      filterPois    : filterPois,
      showModal     : showModal
    };

    // Update available choices when the data changes.
    $rootScope.$on('poiData:changed', function() {
      service.themes = POIData.getThemes();
      selected.themes = service.themes.slice();
      $log.debug('Filters: available themes updated to ' + service.themes.join(', '));
    });

    return service;

    ////////////////////

    /**
     * Returns the currently selected filters.
     */
    function getSelected() {
      return _.cloneDeep(selected);
    }

    /**
     * Update currently selected filters:
     *
     *     Filters.update({
     *       themes: [ 'Some theme', 'Some other theme' ]
     *     });
     */
    function updateSelected(changes) {

      var changed = false;

      _.each(changes, function(value, key) {
        var currentValue = selected[key];
        if (!_.isEqual(value, currentValue)) {
          selected[key] = value;
          changed = true;
        }
      });

      if (changed) {
        $rootScope.$emit('filters:changed', selected);
      }
    }

    /**
     * Filters points of interest using the currently selected filters.
     */
    function filterPois(pois) {

      var n = pois.length;

      if (selected.themes.length < service.themes.length) {
        pois = _.filter(pois, matchBySelectedThemes);
      }

      $log.debug('Filters: ' + n + ' points of interest filtered to ' + pois.length + ' matching points with criteria ' + JSON.stringify(selected));

      return pois;
    }

    /**
     * Shows a modal dialog to configure filters.
     */
    function showModal($scope) {
      $log.debug('Showing filters modal');
      return $ionicModal.fromTemplateUrl('filters.modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      });
    }

    function matchBySelectedThemes(poi) {
      return _.isObject(poi.properties) && _.includes(selected.themes, poi.properties.theme_name);
    }
  }
})();
