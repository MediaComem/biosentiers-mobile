(function() {
  'use strict';
  angular
    .module('activity-tracker-module')
    .factory('BaseLog', BaseLogFn);

  function BaseLogFn() {
    var version = "0.1.0";
    /**
     * The base class for Logs
     * @constructor
     */
    function BaseLog(type, content) {
      if (!type || !angular.isString(type)) throw TypeError("BaseLog Class: You must provide a string value for the type parameter of the BaseLog constructor.");
      if (!angular.isObject(content)) throw new TypeError("BaseLog Class: The 'content' argument of the BaseLog constructor must be of type object.");
      this.occurredAt = (new Date()).toISOString();
      this.version = version;
      this.properties = content || {};
      this.type = type;
    }

    return BaseLog;
  }
})();
