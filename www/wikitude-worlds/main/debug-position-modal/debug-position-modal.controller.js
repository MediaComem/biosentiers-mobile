/**
 * Created by Mathias on 25.08.2016.
 * This is the controller fot the debug position modal.
 * It allows the user to fake his position to either the available ones or a custom one.
 */
(function () {
  'use strict';

  angular
    .module('debug-position-modal')
    .controller('DebugCtrl', DebugCtrl);

  function DebugCtrl(AppActions, DebugPositionModal, $log) {
    var ctrl = this;

    ctrl.position = {};
    ctrl.close = DebugPositionModal.close;
    ctrl.balises = balises;
    ctrl.heig = heig;
    ctrl.plage = plage;
    ctrl.cheseaux = cheseaux;
    ctrl.champPittet = champPittet;
    ctrl.custom = custom;

    ////////////////////

    /**
     * Sets the position to the St-Roch building
     */
    function heig() {
      setPosition(46.781058, 6.647179, 431);
    }

    /**
     * Sets the position to the beach of Yverdon
     */
    function plage() {
      setPosition(46.784083, 6.652281, 431);
    }

    /**
     * Sets the position to the Cheaseaux building
     */
    function cheseaux() {
      setPosition(46.779043, 6.659222, 448);
    }

    /**
     * Sets the position to Champ Pitter
     */
    function champPittet() {
      setPosition(46.7837611642946, 6.66567090924512, 436.74);
    }

    /**
     * Sets the position to the given coordinates
     */
    function custom() {
      if (ctrl.position.hasOwnProperty('lat') && ctrl.position.hasOwnProperty('lon') && ctrl.position.hasOwnProperty('alt')) {
        setPosition(ctrl.position.lat, ctrl.position.lon, ctrl.position.alt)
      } else {
        AppActions.execute('toast', {message: "Des champs ne sont pas remplis"});
      }
    }

    /**
     * Sets the position to one a the beacon in the path.
     * The first beacon (num = 1) is located at the train station
     * The second beacon (num = 2) is located at the tourism office
     * @param num The number of the beacon to set position at
     */
    function balises(num) {
      switch (num) {
        case 1:
          setPosition(46.781025850072695, 6.641159078988079, 431);
          break;
        case 2:
          setPosition(46.780397285829991, 6.643032521127623, 431);
          break;
        default:
          throw new TypeError('Numéro inconnu');
      }
    }

    /**
     * Private function that actually sets the fake user's position
     * @param lat The latitude of the faked position
     * @param lon The longitude of the faked position
     * @param alt The altitude of the faked position
     */
    function setPosition(lat, lon, alt) {
      DebugPositionModal.close().then(function (success) {
        $log.debug(success);
        AppActions.execute('setPosition', {lat: lat, lon: lon, alt: alt});
      }).catch(function (error) {
        $log.error(error);
      });
    }
  }
})();
