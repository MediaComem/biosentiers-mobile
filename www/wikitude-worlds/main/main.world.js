/**
 * Created by Mathias on 02.05.2016.
 */
angular
  .module('ar')
  .run(run);

function run(Do, POI, $rootScope) {
  World = {
    userCoord: {},
    markerList: [],
    poiData: null,
    setPoiData: setPoiData,
    markerClick: null,
    createMarker: function (poi_data) {
      console.log(poi_data);
      this.markerList[poi_data.id] = new POI(poi_data, this.markerClick);
    }
  };

  AR.context.scene.cullingDistance = 100000;
  AR.context.scene.scalingFactor = 0.2;
  AR.context.onScreenClick = onScreenClick;
  AR.context.onLocationChanged = onLocationChanged;

  ////////////////////

  function onScreenClick() {
    console.log('screen clicked');
  }

  function onLocationChanged(lat, lon, alt, acc) {
    console.log('coord', lat, lon, alt, acc);
    World.userCoord = {lat: lat, lon: lon, alt: alt};
    //Do.action('showPos', World.userCoord);
  }

  function setPoiData(data) {
    console.log('setting the poi data');
    World.poiData = data;
    $rootScope.$emit('marker:ready');
  }
}
