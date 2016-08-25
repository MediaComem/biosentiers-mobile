/**
 * Created by Mathias on 23.08.2016.
 */
(function () {
  'use strict';

  angular
    .module('ar')
    .factory('Modals', Modals);

  function Modals($ionicModal) {
    var modals = {
      showBigMapModal: showBigMapModal,
      closeCurrent   : closeCurrent
    };

    var current;

    return modals;

    ////////////////////

    function showBigMapModal($scope) {
      $ionicModal.fromTemplateUrl('modal.big.map.html', {
        scope    : $scope,
        animation: 'slide-in-up'
      }).then(modalLoaded);
    }

    function closeCurrent() {
      current.hide();
    }

    function modalLoaded(modal) {
      current = modal;
      current.show();
    }
  }
})();
