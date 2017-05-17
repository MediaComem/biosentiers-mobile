/**
 * Created by Mathias on 25.08.2016.
 * This is the controller fot the debug position modal.
 * It allows the user to fake his position to either the available ones or a custom one.
 */
(function() {
  'use strict';

  angular
    .module('debug-position-modal')
    .controller('DebugCtrl', DebugCtrl);

  function DebugCtrl(AppActions, Modals, UserLocation, $log) {
    var debug = this;

    debug.position = {};
    debug.remove = Modals.removeCurrent;
    debug.gare = gare;
    debug.office = office;
    debug.heig = heig;
    debug.plage = plage;
    debug.cheseaux = cheseaux;
    debug.champPittet = champPittet;
    debug.custom = custom;

    ////////////////////

    /**
     * Sets the position to the St-Roch building
     */
    function heig() {
      setPosition(46.78071086, 6.64763376, 432);
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
     * Sets the position to Champ Pitter
     */
    function gare() {
      setPosition(46.781025850072695, 6.641159078988079, 431);
    }

    /**
     * Sets the position to Champ Pitter
     */
    function office() {
      setPosition(46.780397285829991, 6.643032521127623, 431);
    }

    /**
     * Sets the position to the given coordinates
     */
    function custom() {
      var pos = {
        lat: Number(debug.position.lat || UserLocation.real.lat),
        lon: Number(debug.position.lon || UserLocation.real.lon),
        alt: Number(debug.position.alt || UserLocation.real.alt)
      };
      $log.log('DebugPosition:custom', pos);
      setPosition(pos.lat, pos.lon, pos.alt);
    }

    /**
     * Private function that actually sets the fake user's position
     * @param lat The latitude of the faked position
     * @param lon The longitude of the faked position
     * @param alt The altitude of the faked position
     */
    function setPosition(lat, lon, alt) {
      Modals.removeCurrent().then(function(success) {
        $log.debug(success);
        AppActions.execute('setPosition', {lat: lat, lon: lon, alt: alt});
      }).catch(function(error) {
        $log.error(error);
      });
    }
  }
})();
