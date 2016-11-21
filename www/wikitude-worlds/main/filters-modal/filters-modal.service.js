(function() {
  'use strict';

  angular
    .module('filters-modal')
    .factory('FiltersModal', FiltersModalService);

  function FiltersModalService($ionicModal, Modals) {
    var service = {
      show  : showModal,
      hide  : Modals.hideCurrent,
      remove: Modals.removeCurrent
    };

    return service;

    ////////////////////

    /**
     * Shows a modal dialog to configure filters.
     */
    function showModal($scope) {
      return $ionicModal.fromTemplateUrl('filters-modal/filters-modal.html', {
        scope    : $scope,
        animation: 'slide-in-up'
      }).then(Modals.showCurrent);
    }
  }
})();
