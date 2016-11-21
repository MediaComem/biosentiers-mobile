/**
 * Created by Mathias on 31.08.2016.
 */
(function () {
	'use strict';
	angular
		.module('modals')
		.factory('Modals', ModalsService);

	function ModalsService(ArView, $q) {
		var service = {
			showCurrent  : showModal,
			hideCurrent  : hideModal,
			removeCurrent: removeModal
		};

		var current = null;

		return service;

		////////////////////

		/**
		 * Sets the received modal as the current modal, and opens it.
		 * While doing so, deactivate the camera and sensors for the AR to spare resources.
		 * @param modal The modal to set as current.
		 */
		function showModal(modal) {
			if (modal) {
				return modal.show().then(function () {
					current = modal;
					ArView.pauseAr();
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
				ArView.resumeAr();
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
				ArView.resumeAr();
				return current.remove();
			} else {
				return $q.reject('No active modal to remove');
			}
		}
	}
})
();
