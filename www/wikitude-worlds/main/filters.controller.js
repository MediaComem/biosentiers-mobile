(function() {
  'use strict';

  angular
    .module('ar')
    .controller('FiltersCtrl', FiltersCtrl)

  function FiltersCtrl(Filters, $scope) {
    var ctrl = this;

    // Data
    ctrl.themes = Filters.themes;

    ctrl.selected = {
      themes: themesArrayToCheckedThemesObject(Filters.getSelected().themes)
    };

    // Functions
    ctrl.getThemeImageUrl = getThemeImageUrl;

    // Events
    $scope.$watch('filters.selected.themes', updateThemeFilters, true);

    ////////////////////

    function updateThemeFilters(checkedThemes) {

      var selectedThemes = _.reduce(selectedThemes, function(memo, selected, theme) {
        if (selected) {
          memo.push(theme);
        }

        return memo;
      }, []);

      Filters.updateSelected({
        themes: checkedThemesObjectToThemesArray(checkedThemes)
      });
    }

    function getThemeImageUrl(theme) {
      return 'assets/' + theme + '.png';
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
      return _.reduce(checkedThemes, function(memo, selected, theme) {
        if (selected) {
          memo.push(theme);
        }

        return memo;
      }, []);
    }
  }
})();
