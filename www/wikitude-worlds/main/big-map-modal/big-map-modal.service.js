/**
 * Created by Mathias on 23.08.2016.
 * This service handles showing and closing the modal for the Big Map
 */
(function () {
  'use strict';

  angular
    .module('big-map-modal')
    .factory('BigMapModal', BigMapModalService);

  function BigMapModalService($ionicModal, Modals) {

    var service = {
      show : showModal,
      hide: Modals.hideCurrent,
      remove: Modals.removeCurrent
    };

    return service;

    ////////////////////

    /**
     * Opens the BigMapModal using the $scope parameter as its scope.
     * @param $scope The scope to use as the modal scope.
     */
    function showModal($scope) {
      return $ionicModal.fromTemplateUrl('big-map-modal/big-map-modal.html', {
        scope    : $scope,
        animation: 'slide-in-up'
      }).then(Modals.showCurrent);
    }
  }
})();
