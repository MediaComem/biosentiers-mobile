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
			removeCurrent: removeModal,
			get isCurrentShown() {return current ? current.isShown : false;}
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
				return modal.show().then(function () {
					current = modal;
					ArView.pauseAr();
				});
			} else {
				return $q.reject('No modal to show');
			}
		}

		/**
		 * Hides the current, providing that it exists.
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
