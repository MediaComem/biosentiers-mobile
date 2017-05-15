/**
 * Created by Mathias Oberson on 12.05.2017.
 */
(function() {
  'use strict';

  angular
    .module('debug-log')
    .directive('debugLog', debugLogFn)
    .directive('debugToggle', debugToggleFn)
    .service('DebugLog', DebugLog)
    .controller('DebugLogCtrl', DebugLogCtrlFn);

  function debugToggleFn() {
    return {
      restrict    : 'E',
      replace     : true,
      template : '<div id="debug-toggle"></div>'
    }
  }

  function debugLogFn() {
    return {
      restrict    : 'E',
      replace     : true,
      controller  : 'DebugLogCtrl',
      controllerAs: 'debLog',
      templateUrl : 'debug-log/debug-log.html'
    };
  }

  function DebugLogCtrlFn(DebugLog) {
    var debLog = this;
    debLog.logs = DebugLog.logs;
  }

  function DebugLog($log) {
    var logs = [];
    var service = {
      logs       : logs,
      add        : add,
      removeFirst: removeFirst
    };

    return service;

    ////////////////////

    function add(log) {
      logs.push({time: Date.now(), content: log});
      // $log.log('DebugLog:add:new log added', log, logs);
    }

    function removeFirst() {
      if (logs.length <= 5) return;
      $log.log('DebugLog:removeFirst:before removing', logs);
      service.logs.shift();
      $log.log('DebugLog:removeFirst:after removing', logs);
    }
  }
})();
