(function() {
  'use strict';

  angular
    .module('filters-modal')
    .factory('FiltersModal', FiltersModalService);

  function FiltersModalService($ionicModal, $log) {

    var service = {
      showModal: showModal
    };

    return service;

    ////////////////////

    /**
     * Shows a modal dialog to configure filters.
     */
    function showModal($scope) {
      $log.debug('Showing filters modal');
      return $ionicModal.fromTemplateUrl('filters-modal/filters-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      });
    }
  }
})();
