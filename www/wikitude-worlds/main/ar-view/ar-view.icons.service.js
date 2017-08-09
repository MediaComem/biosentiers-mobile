/**
 * Created by Mathias on 04.05.2016.
 * This is a service that manages the ImageDrawable used when creating new ArMarker.
 * ImageDrawables are objects representing the visuals placed in a particular geolocation in the ArView.
 * This service should be used whenever one wants to create/retrieve an ImageDrawable of a certain type.
 * ImageDrawables can be either 'active' or 'inactive' and have either a Seen Icon or a Classic Icon.
 * An active ImageDrawable has full opacity, whereas an inactive one has 0.5 opacity.
 * Seen Icon will be used when the ImageDrawable is fetched for an ArMarker that has already been seen.
 * Classic Icon are for ArMarker that remains to be seen.
 */
(function() {
  'use strict';

  angular
    .module('ar-view')
    .factory('ArIcons', ArIconsService);

  function ArIconsService($log) {

    var TAG               = "[ArIcons] ",
        iconsInactive     = [],
        iconsActive       = [],
        iconsSeenActive   = [],
        iconsSeenInactive = [];

    var service = {
      getInactive: getInactiveIcon,
      getActive  : getActiveIcon
    };

    return service;

    ////////////////////

    /**
     * Returns the Inactive ImageDrawable corresponding to the given type. An Inactive ImageDrawable have an opacity of 0.5.
     * If hasBeenSeen is set to true, the ImageDrawable returned will have a Seen Icon for this type.
     * If hasBeenSeen is undefined or set to false, it will have a classic Icon for the given type.
     * @param type The type of the Inactive ImageDrawable.
     * @param hasBeenSeen A Boolean indicating if the returned ImageDrawable should have a Seen Icon (true) or a classis Icon (false or undefined).
     * @return {AR.ImageDrawable} The requested Inactive ImageDrawable.
     */
    function getInactiveIcon(type, hasBeenSeen) {
      return !!hasBeenSeen ? getIcon(type, 'inactive', true) : getIcon(type, 'inactive', false);
    }

    /**
     * Returns the Active ImageDrawable corresponding to the given type. An Active ImageDrawable have an opacity of 1.
     * If hasBeenSeen is set to true, the ImageDrawable returned will have a Seen Icon for this type.
     * If hasBeenSeen is undefined or set to false, it will have a classic Icon for the given type.
     * @param type The type of the Active ImageDrawable.
     * @param hasBeenSeen A Boolean indicating if the returned ImageDrawable should have a Seen Icon (true) or a classis Icon (false or undefined).
     * @return {AR.ImageDrawable} The requested Active ImageDrawable.
     */
    function getActiveIcon(type, hasBeenSeen) {
      return !!hasBeenSeen ? getIcon(type, 'active', true) : getIcon(type, 'active', false);
    }

    /**
     * Internal function that fetchs the correct ImageDrawable for the given type in the given state.
     * The returned ImageDrawable will have a Seen Icon if hasBeenSeen is true, and a classis Icon if hasBeenSeen is false.
     * Depending of the state and the value of hasBeenSeen, the ImageDrawable will be looked upon in a particular storage (array) :
     *  * with state = 'active' and hasBeenSeen = 'true', it will be searched for in the iconsSeeActive storage
     *  * with state = 'active' and hasBeenSeen = 'false', it will be searched for in the iconsActive storage
     *  * with state = 'inactive' and hasBeenSeen = 'true', it will be searched for in the iconsSeeInactive storage
     *  * with state = 'inactive' and hasBeenSeen = 'false', it will be searched for in the iconsInactive storage
     * The ImageDrawable are Singletons.
     * @param type
     * @param state
     * @param hasBeenSeen
     * @return {AR.ImageDrawable} The requested ImageDrawable.
     */
    function getIcon(type, state, hasBeenSeen) {
      var storage, suffix = '';
      if (state === 'active') {
        storage = hasBeenSeen ? iconsSeenActive : iconsActive;
      } else if (state === 'inactive') {
        storage = hasBeenSeen ? iconsSeenInactive : iconsInactive;
      }

      if (!storage[type] || storage[type].destroyed) {
        if (type !== 'start' && type !== 'end') {
          if (state === 'inactive') suffix += '_far';
          if (hasBeenSeen) suffix += '_seen';
        }
        suffix += '.png';
        var img = new AR.ImageResource("assets/icons/" + type + suffix, {
          onError: function() {
            throw new SyntaxError("Aucun marqueur existant pour le type '" + type + "'.");
          }
        });
        storage[type] = new AR.ImageDrawable(img, 1, {
          zOrder : 0,
          opacity: 1
        });
      }

      $log.debug(TAG + "getIcon()", type, state, hasBeenSeen, storage);
      return storage[type];
    }
  }
})();
