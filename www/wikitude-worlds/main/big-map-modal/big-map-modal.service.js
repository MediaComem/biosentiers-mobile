/**
 * Created by Mathias on 23.08.2016.
 * This service handles showing and closing the modal for the Big Map
 */
(function () {
  'use strict';

  angular
    .module('big-map-modal')
    .factory('BigMapModal', BigMapModalService);

  function BigMapModalService($ionicModal) {

    var service = {
      open : openModal,
      close: closeModal
    };

    var current = null;

    return service;

    ////////////////////

    /**
     * Opens the BigMapModal using the $scope parameter as its scope.
     * @param $scope The scope to use as the modal scope.
     */
    function openModal($scope) {
      $ionicModal.fromTemplateUrl('big-map-modal/big-map-modal.html', {
        scope    : $scope,
        animation: 'slide-in-up'
      }).then(modalLoaded);
    }

    /**
     * Closes the BigMapModal, providing that it exists.
     */
    function closeModal() {
      current !== null && current.hide();
    }

    /**
     * Sets the received modal as the current BigMapModal.
     * @param modal The modal to set as current.
     */
    function modalLoaded(modal) {
      current = modal;
      current.show();
    }
  }
})();
