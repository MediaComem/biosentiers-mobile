(function() {
  'use strict';
  angular
    .module('event-log-module')
    .factory('EventLog', EventLogFn);

  function EventLogFn() {
    var version = "0.2.2";
    /**
     * The base class for Logs
     * @constructor
     */
    function EventLog(type, content) {
      if (!type || !angular.isString(type)) throw TypeError("EventLog Class: You must provide a string value for the type parameter of the EventLog constructor.");
      if (content && !angular.isObject(content)) throw new TypeError("EventLog Class: The 'content' argument of the EventLog constructor must be of type object.");
      this.occurredAt = (new Date()).toISOString();
      this.version = version;
      this.properties = content || {};
      this.type = type;
    }

    return EventLog;
  }
})();
