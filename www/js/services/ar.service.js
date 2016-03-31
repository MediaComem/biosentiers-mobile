/**
 * Created by Mathias on 29.03.2016.
 */
(function () {
  'use strict';

  angular
    .module('ARModule', [])
    .service('ARService', ARService);

  function ARService() {
    this.wikitude = cordova.require('com.wikitude.phonegap.WikitudePlugin.WikitudePlugin');
    this.features = ['geo', '2dtracking'];
    this.config = {camera_position: 'back'};
    this.deviceIsSupported = false;
    this.url = 'wikitude/index.html';
    this.fonction = function () {
      console.log('fonction AR');
    };
  }
})();
