(function() {
  'use strict';
  angular
    .module('activity-tracker-module')
    .factory('EventLogFactory', EventListFn);

  /*
   * Factory that stores and returns new EventLog object corresponding to the property that is accessed.
   * Note : All EventLog object are returned through property getters.
   */
  function EventListFn(EventLog, $cordovaNetwork) {
    return {
      lifecycle: {
        app: {
          get started() { return new EventLog('lifecycle.app.started'); },
          get paused() { return new EventLog('lifecycle.app.paused'); },
          get resumed() { return new EventLog('lifecycle.app.resumed') }
        }
      },
      network  : {
        get offline() { return new EventLog('network.offline'); },
        get online() { return new EventLog('network.online', {connectionType: $cordovaNetwork.getNetwork()}); }
      }
    }
  }
})();
