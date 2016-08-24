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
      current        : null,
      showBigMapModal: showBigMapModal,
      closeCurrent   : closeCurrent
    };

    return modals;

    ////////////////////

    function showBigMapModal($scope) {
      $ionicModal.fromTemplateUrl('modal.big.map.html', {
        scope    : $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        modals.current = modal;
        modals.current.show();
      });
    }

    function closeCurrent() {
      modals.current.hide();
    }
  }
})();
