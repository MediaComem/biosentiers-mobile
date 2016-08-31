/**
 * Created by Mathias on 31.08.2016.
 */
(function () {
  'use strict';
  angular
    .module('modals')
    .factory('Modals', ModalsService);

  function ModalsService($q) {
    var service = {
      show  : showModal,
      hide  : hideModal,
      remove: removeModal
    };

    var current = null;

    return service;

    ////////////////////

    /**
     * Sets the received modal as the current modal, and opens it.
     * @param modal The modal to set as current.
     */
    function showModal(modal) {
      if (modal) {
        current = modal;
        return current.show();
      } else {
        return $q.reject('No modal to show');
      }
    }

    /**
     * Hides the BigMapModal, providing that it exists.
     * @returns Promise
     */
    function hideModal() {
      if (current !== null) {
        return current.hide();
      } else {
        return $q.reject('No active modal to close');
      }
    }

    /**
     * Removes the modal, providing that it exists
     * @returns Promise
     */
    function removeModal() {
      if (current !== null) {
        return current.remove();
      } else {
        return $q.reject('No active modal to remove');
      }
    }

  }
})
();
