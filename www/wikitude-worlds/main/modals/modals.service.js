/**
 * Created by Mathias on 31.08.2016.
 */
(function() {
  'use strict';
  angular
    .module('modals')
    .factory('Modals', ModalsService);

  function ModalsService(ArView, $ionicModal, $q) {
    var service = {
      showBigMap       : showBigMap,
      showDebugPosition: showDebugPosition,
      showFilters      : showFilters,
      showPoi          : showPoi,
      hideCurrent      : hideModal,
      removeCurrent    : removeModal
    };

    var current = null;

    return service;

    ////////////////////

    /**
     * Opens the BigMapModal using the $scope parameter as its scope.
     * @param $scope The scope to use as the modal scope.
     */
    function showBigMap($scope) {
      return $ionicModal.fromTemplateUrl('big-map-modal/big-map-modal.html', {
        scope    : $scope,
        animation: 'slide-in-up'
      }).then(loadModal);
    }

    /**
     * Opens the modal using the $scope parameter as its scope.
     * @param $scope The scope to use as the modal scope.
     */
    function showDebugPosition($scope) {
      return $ionicModal.fromTemplateUrl('debug-position-modal/debug-position-modal.html', {
        scope    : $scope,
        animation: 'slide-in-up'
      }).then(loadModal);
    }

    /**
     * Shows a modal dialog to configure filters.
     * @param $scope The scope to use as the modal scope.
     */
    function showFilters($scope) {
      return $ionicModal.fromTemplateUrl('filters-modal/filters-modal.html', {
        scope    : $scope,
        animation: 'slide-in-up'
      }).then(loadModal);
    }

    /**
     * Shows the modal for the clicked POI depending on its type.
     * @param $scope The scope to use as the modal scope.
     */
    function showPoi($scope) {
      $ionicModal.fromTemplateUrl('poi-modal/poi-modal.html', {
        scope    : $scope,
        animation: 'slide-in-up'
      }).then(loadModal);
    }

    /**
     * Sets the received modal as the current modal, and opens it.
     * While doing so, deactivate the camera and sensors for the AR to spare resources.
     * @param modal The modal to set as current.
     */
    function loadModal(modal) {
      if (modal) {
        return modal.show().then(function() {
          current = modal;
          ArView.pauseAr(true);
        });
      } else {
        return $q.reject('No modal to show');
      }
    }

    /**
     * Hides the current modal, providing that it exists.
     * While doing so, activate the camera and sensors for the AR.
     * @returns Promise
     */
    function hideModal() {
      if (current !== null) {
        ArView.pauseAr(false);
        return current.hide();
      } else {
        return $q.reject('No active modal to close');
      }
    }

    /**
     * Removes the current modal, providing that it exists
     * While doing so, activate the camera and sensors for the AR.
     * @returns Promise
     */
    function removeModal() {
      if (current !== null) {
        ArView.pauseAr(false);
        return current.remove();
      } else {
        return $q.reject('No active modal to remove');
      }
    }
  }
})
();
