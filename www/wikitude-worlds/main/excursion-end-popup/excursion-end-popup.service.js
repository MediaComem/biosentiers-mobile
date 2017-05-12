/**
 * Created by Mathias Oberson on 12.05.2017.
 */
(function() {
  'use strict';
  angular
    .module('excursion-end-popup')
    .service('EndPopup', EndPopup);

  function EndPopup($ionicPopup) {
    var service, yesButton, noButton;

    service = {
      manual   : manual,
      automatic: automatic
    };

    yesButton = {
      text : 'Oui',
      type : 'button-balanced',
      onTap: function() {
        return true;
      }
    };

    noButton = {
      text : 'Non',
      type : 'button-outline button-assertive',
      onTap: function() {
        return false;
      }
    };

    return service;

    ////////////////////

    function manual() {
      return $ionicPopup.show({
        title   : 'Terminer la sortie ?',
        template: '<p>(Vous ne pourrez plus y accéder)</p>',
        buttons : [noButton, yesButton]
      });
    }

    function automatic() {
      return $ionicPopup.show({
        title   : 'Fin de sentier atteint',
        template: '<p>Souhaitez-vous mettre fin à votre sortie ?</p><p>(Vous ne pourrez plus y accéder)</p>',
        buttons : [noButton, yesButton]
      });
    }
  }
})();
