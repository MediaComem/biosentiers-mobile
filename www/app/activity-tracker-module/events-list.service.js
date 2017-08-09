(function() {
  'use strict';
  angular
    .module('activity-tracker-module')
    .factory('EventLogFactory', EventListFn);

  /*
   * Factory that stores and returns new EventLog object corresponding to the property that is accessed.
   * Some events requires an additionnal prop object argument for information that can not be retrieved by this service.
   * Please, check each individual functions.
   */
  function EventListFn(EventLog, $cordovaNetwork) {
    return {
      lifecycle: {
        app: {
          started: function() { return new EventLog('lifecycle.app.started'); },
          paused: function() { return new EventLog('lifecycle.app.paused'); },
          resumed: function() { return new EventLog('lifecycle.app.resumed') }
        }
      },
      network  : {
        offline: function() { return new EventLog('network.offline'); },
        online: function() { return new EventLog('network.online', {connectionType: $cordovaNetwork.getNetwork()}); }
      }
    }
  }
})();
