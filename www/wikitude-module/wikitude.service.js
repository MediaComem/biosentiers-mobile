/**
 * Created by Mathias on 29.03.2016.
 */
(function () {
  'use strict';

  angular
    .module('WikitudeModule')
    .factory('Wikitude', ARFactory);

  function ARService() {
    var plugin = cordova.require('com.wikitude.phonegap.WikitudePlugin.WikitudePlugin');
    this.result = function () {
      console.log(plugin);
    }
  }

  function ARProvider() {
    var service = {
      plugin: null,
      result: result
    };

    this.loadPlugin = loadPlugin;
    this.$get = $get;

    ////////////////////

    function result() {
      console.log(service.plugin);
    }

    function $get() {
      return service;
    }

    function loadPlugin() {
      service.plugin = cordova.require('com.wikitude.phonegap.WikitudePlugin.WikitudePlugin');
    }
  }

  function ARFactory() {

    var plugin = null;

    var service = {
      checkDevice: checkDevice,
      config: {camera_position: 'back'},
      deviceIsSupported: false,
      features: ['geo', '2dtracking'],
      getPlugin: getWikitude,
      lauchAR: launchAR,
      url: 'wikitude-app/index.html'
    };

    return service;

    ////////////////////

    function launchAR() {
      console.log(plugin);
    }

    function getWikitude() {
      if (plugin === null) {
        plugin = cordova.require('com.wikitude.phonegap.WikitudePlugin.WikitudePlugin');
      }
      return plugin;
    }

    function checkDevice() {
      return true;
    }
  }

  //function ARFactory() {
  //
  //  var plugin = cordova.require('com.wikitude.phonegap.WikitudePlugin.WikitudePlugin');
  //  console.log(plugin);
  //
  //  var service = {
  //    wikitude: plugin,
  //    features: ['geo', '2dtracking'],
  //    config: {camera_position: 'back'},
  //    deviceIsSupported: false,
  //    url: 'wikitude-app/index.html',
  //    launch: launch
  //  };
  //
  //  return service;
  //
  //  ////////////////////
  //
  //  function launch() {
  //    console.log('launching AR');
  //  }
  //}
})();
