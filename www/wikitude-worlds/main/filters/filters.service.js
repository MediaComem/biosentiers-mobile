(function() {
  'use strict';

  angular
    .module('filters')
    .factory('Filters', FiltersService);

  function FiltersService($log, Poi, rx) {

    // Currently selected filters.
    // Update by calling `Filters.update(selected)`.
    var selected = {
      themes: []
    };

    var filtersChangeSubject = new rx.BehaviorSubject(selected);

    var service = {
      themes          : [], // Available choices to use for filtering.
      getSelected     : getSelected,
      updateSelected  : updateSelected,
      filterPois      : filterPois,
      filtersChangeObs: filtersChangeSubject.asObservable()
    };

    // Update available choices when the data changes.
    Poi.dataChangeObs.subscribe(updateAvailableChoices);

    return service;

    ////////////////////

    /**
     * Updates available filters choice, based on the ones in the newData param.
     * @param newData
     */
    function updateAvailableChoices(newData) {
      if (newData.themes.length) {
        service.themes = newData.themes;
        selected.themes = newData.themes.slice();
        $log.debug('Filters: available themes updated to ' + service.themes.join(', '));
      }
    }

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
        filtersChangeSubject.onNext(selected);
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

    function matchBySelectedThemes(poi) {
      return _.isObject(poi.properties) && _.includes(selected.themes, poi.properties.theme_name);
    }
  }
})();
