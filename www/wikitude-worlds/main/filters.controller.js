(function() {
  'use strict';

  angular
    .module('ar')
    .controller('FiltersCtrl', FiltersCtrl)

  function FiltersCtrl(Filters, $scope) {
    var ctrl = this;

    ctrl.themes = Filters.themes;
    ctrl.selected = Filters.getSelected();

    $scope.$watch('filters.selected', function(selected) {
      Filters.updateSelected(selected);
    }, true);
  }
})();
