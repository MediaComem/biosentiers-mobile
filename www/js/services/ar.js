/**
 * Created by Mathias on 29.03.2016.
 */
app.service('AR', function() {
  this.wikitude = cordova.require('com.wikitude.phonegap.WikitudePlugin.WikitudePlugin');
  this.features = ['geo', '2dtracking'];
  this.config = {camera_position: 'back'};
  this.deviceIsSupported = false;
  this.url = 'wikitude/index.html';
  this.fonction = function() {
    console.log('fonction AR');
  };
});
