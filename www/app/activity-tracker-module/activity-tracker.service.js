/**
 * Created by Mathias Oberson on 10.02.2017.
 */
(function() {
  'use strict';
  angular
    .module('activity-tracker-module')
    .service('ActivityTracker', ActivityTrackerService);

  function ActivityTrackerService($log) {
    return {
      logResume: function() {
        $log.log('AR Resumed');
      }
    }
  }
})();