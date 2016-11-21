/**
 * Created by Mathias on 29.08.2016.
 * This service handles opening and closing the DebugPositionModal
 */
(function() {
  'use strict';
  angular
    .module('debug-position-modal')
    .factory('DebugPositionModal', DebugPositionModalService);

  function DebugPositionModalService($ionicModal, Modals) {
    var service = {
      show  : showModal,
      hide: Modals.hideCurrent,
      remove: Modals.removeCurrent
    };

    return service;

    ////////////////////

    /**
     * Opens the modal using the $scope parameter as its scope.
     * @param $scope The scope to use as the modal scope.
     */
    function showModal($scope) {
      return $ionicModal.fromTemplateUrl('debug-position-modal/debug-position-modal.html', {
        scope    : $scope,
        animation: 'slide-in-up'
      }).then(Modals.showCurrent);
    }
  }
})();
