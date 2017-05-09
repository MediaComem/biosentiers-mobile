/**
 * Created by Mathias on 29.08.2016.
 * This provider manages the different icons needed on the several map in the application.
 * Since it's used by both the main app and the Ar app(s), the URL to retrieve the correct icon is not the same.
 * This, this provider needs to be configured in a config block by calling the setIconBaseUrl method.
 */
(function() {
  'use strict';
  angular.module('map-icons-module', []);

  angular
    .module('map-icons-module')
    .provider('MapIcons', MapIconsProvider);

  function MapIconsProvider() {

    var iconBaseUrl, icons;

    this.setIconBaseUrl = setIconBaseUrl;

    this.$get = service;

    ////////////////////

    /**
     * Sets the correct URL to the icon folder that contains the icons' images.
     * This URL do not need a '/' at the end.
     * @param url {String} The URL to the icons folder. Do not put a slash at the end.
     */
    function setIconBaseUrl(url) {
      if (typeof url !== 'string') throw new TypeError('The setIconBaseUrl method from the MapIconsProvider needs a string value as its only parameter. ' + typeof url + ' given.');
      iconBaseUrl = url;
    }

    /**
     * Sets up the actual service and returns it.
     * @return {{user: Object, get: getIcon}}
     */
    function service() {
      var service = {
        /**
         * Returns the icon definition for the user.
         * Usage : var userIcon = Icons.user
         * @returns Object
         */
        get user() {return angular.copy(icons.user);},
        get: getIcon
      };

      icons = {
        user     : new IconConf('user', 20, 10),
        start    : new IconConf('start', 16, 8),
        end      : new IconConf('end', 16, 8),
        bird     : new IconConf('bird', 16, 8),
        flower   : new IconConf('flower', 16, 8),
        butterfly: new IconConf('butterfly', 16, 8),
        tree     : new IconConf('tree', 16, 8)
      };

      return service;
    }

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
      this.iconUrl = iconBaseUrl + '/' + name + '.png';
      this.iconSize = [size, size];
      this.iconAnchor = [anchor, anchor];
    }
  }
})();
