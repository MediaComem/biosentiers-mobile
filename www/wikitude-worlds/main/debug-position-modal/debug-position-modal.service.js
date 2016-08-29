/**
 * Created by Mathias on 29.08.2016.
 * This service handles opening and closing the DebugPositionModal
 */
(function () {
  'use strict';
  angular
    .module('debug-position-modal')
    .factory('DebugPositionModal', DebugPositionModalService);

  function DebugPositionModalService($ionicModal, $q) {
    var service = {
      open : openModal,
      close: closeModal
    };

    var current = null;

    return service;

    ////////////////////

    /**
     * Opens the modal using the $scope parameter as its scope.
     * @param $scope The scope to use as the modal scope.
     */
    function openModal($scope) {
      $ionicModal.fromTemplateUrl('debug-position-modal/debug-position-modal.html', {
        scope    : $scope,
        animation: 'slide-in-up'
      }).then(modalLoaded);
    }

    /**
     * Closes the modal, providing that it exists.
     */
    function closeModal() {
      if (current !== null) {
        return current.hide();
      } else {
        return $q.reject('No active modal to close');
      }
    }

    /**
     * Sets the received modal as the current modal.
     * @param modal The modal to set as current.
     */
    function modalLoaded(modal) {
      current = modal;
      current.show();
    }

  }
})();
