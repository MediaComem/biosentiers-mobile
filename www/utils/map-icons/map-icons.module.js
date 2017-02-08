/**
 * Created by Mathias on 29.08.2016.
 * This module manages the different icons needed on the several map in the application
 */
(function() {
  'use strict';
  angular.module('map-icons', []);

  angular
    .module('map-icons')
    .factory('MapIcons', MapIconsService);

  function MapIconsService() {
    var service = {
      /**
       * Returns the icon definition for the user.
       * Usage : var userIcon = Icons.user
       * @returns Object
       */
      get user() {return angular.copy(icons.user);},
      get: getIcon
    };

    var icons = {
      user     : new IconConf('user', 20, 10),
      start    : new IconConf('start', 16, 8),
      end      : new IconConf('end', 16, 8),
      Oiseaux  : new IconConf('Oiseaux', 16, 8),
      Flore    : new IconConf('Flore', 16, 8),
      Papillons: new IconConf('Papillons', 16, 8)
    };

    return service;

    ////////////////////

    /**
     * Returns the icon definition corresponding to the name given.
     * If the name is registered in the 'icons' repository, a copy is returned.
     * If not, undefined is returned.
     * @param name The name of the icon to retrieve
     * @returns Object|undefined
     */
    function getIcon(name) {
      return icons.hasOwnProperty(name) ? angular.copy(icons[name]) : undefined;
    }

    /**
     * Creates an object used to define the icon showed on the leaflet map.
     * @param name The name of the file to use for the icon. Will be fetched from the www/img/icons folder.
     * @param size The size of the icon. Will be used both for height and width.
     * @param anchor The position of the anchor. Will be used for both x and y.
     * @constructor
     */
    function IconConf(name, size, anchor) {
      this.iconUrl = '../../img/icons/' + name + '.png';
      this.iconSize = [size, size];
      this.iconAnchor = [anchor, anchor];
    }
  }
})();
