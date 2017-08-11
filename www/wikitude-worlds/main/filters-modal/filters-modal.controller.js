(function() {
  'use strict';

  angular
    .module('filters-modal')
    .controller('FiltersModalCtrl', FiltersModalCtrl);

  function FiltersModalCtrl(AppActions, EventLogFactory, Excursion, Filters, Modals, $scope) {
    var filters = this;

    filters.remove = Modals.removeCurrent;
    // Public data
    filters.themes = Filters.themes;

    filters.selected = {
      themes  : themesArrayToCheckedThemesObject(Filters.getSelected().themes),
      settings: _.clone(Filters.getSelected().settings)
    };

    // Functions
    filters.getThemeImageUrl = getThemeImageUrl;

    // Events
    var debouncedUpdateThemes = _.debounce(updateThemes, 650);
    $scope.$watch('filters.selected.themes', debouncedUpdateThemes, true);

    var debouncedUpdateSettings = _.debounce(updateSettings, 650);
    $scope.$watch('filters.selected.settings', debouncedUpdateSettings, true);

    ////////////////////

    function updateThemes() {
      Filters.updateSelected({
        themes: checkedThemesObjectToThemesArray(filters.selected.themes)
      });
    }

    function updateSettings() {
      Filters.updateSelected({
        settings: _.clone(filters.selected.settings)
      });
    }

    /**
     * Returns the path to a theme's image, based on the given theme.
     * @param theme The name of the theme for which we want the image's path
     * @return {string} The path to the theme's image
     */
    function getThemeImageUrl(theme) {
      return 'assets/icons/' + theme + '.png';
    }

    /**
     * Transforms
     *     [ "theme1", "theme2", "theme3" ]
     * to
     *     { "theme1": true, "theme2": true, "theme3": true }
     */
    function themesArrayToCheckedThemesObject(themes) {
      return _.reduce(themes, function(memo, theme) {
        memo[theme] = true;
        return memo;
      }, {});
    }

    /**
     * Transforms
     *     { "theme1": true, "theme2": false, "theme3": true }
     * to
     *     [ "theme1", "theme3" ]
     */
    function checkedThemesObjectToThemesArray(checkedThemes) {
      return _.reduce(checkedThemes, function(memo, selected, theme) {
        if (selected) {
          memo.push(theme);
        }
        return memo;
      }, []);
    }
  }
})();
