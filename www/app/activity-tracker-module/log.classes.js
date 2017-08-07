(function() {
  'use strict';
  angular
    .module('activity-tracker-module')
    .factory('BaseLog', BaseLogFn)
    .factory('AppLog', AppLogFn)
    .factory('InterfaceLog', InterfaceLogFn)
    .factory('LocationLog', LocationLogFn);

  function BaseLogFn() {
    var version = "v1.0.0";
    /**
     * The base class for Logs
     * @constructor
     */
    function BaseLog(type, content) {
      if (!type || typeof type !== 'string') throw TypeError("You must provide a string value for the type parameter of the BaseLog constructor.");
      this.createdAt = (new Date()).toISOString();
      this.version = version;
      this.properties = content || {};
      this.type = type;
    }

    return BaseLog;
  }

  function AppLogFn(BaseLog) {
    /**
     *
     * @param content
     * @constructor
     */
    function AppLog(content) {
      BaseLog.call('app', content);
    }

    AppLog.prototype = Object.create(BaseLog.prototype);
    AppLog.prototype.constructor = AppLog;

    return AppLog;
  }

  function InterfaceLogFn(BaseLog) {
    /**
     *
     * @param content
     * @constructor
     */
    function InterfaceLog(content) {
      BaseLog.call('interface', content);
    }

    InterfaceLog.prototype = Object.create(BaseLog.prototype);
    InterfaceLog.prototype.constructor = InterfaceLog;

    return InterfaceLog;
  }

  function LocationLogFn(BaseLog) {
    /**
     *
     * @param content
     * @constructor
     */
    function LocationLog(content) {
      BaseLog.call('location', content);
    }

    LocationLog.prototype = Object.create(BaseLog.prototype);
    LocationLog.prototype.constructor = LocationLog;

    return LocationLog;
  }
})();
