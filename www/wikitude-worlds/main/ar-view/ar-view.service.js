/**
 * Created by Mathias on 04.05.2016.
 */
(function () {
	'use strict';

	angular
		.module('ar-view')
		.factory('ArView', ArViewService);

	function ArViewService(AppActions, ArMarker, Filters, $log, Outing, $rootScope, rx, Timers, turf, UserLocation) {

		// Private data
		var arPointsById      = {},
		    reachLimit        = 250,
		    poisChangeSubject = new rx.Subject();

		var service = {
			init         : init,
			updateAr     : updateAr,
			pauseAr      : pauseAr,
			resumeAr     : resumeAr,
			poisChangeObs: poisChangeSubject.asObservable()
		};

		return service;

		////////////////////

		function init() {
			AR.context.clickBehavior = AR.CONST.CLICK_BEHAVIOR.TOUCH_DOWN;
			AR.context.scene.cullingDistance = 250;
			AR.context.scene.maxScalingDistance = 500;
			AR.context.scene.minScalingDistance = 7;
			AR.context.scene.scalingFactor = 0.01;
			AR.context.onScreenClick = onScreenClick;
			AR.context.onLocationChanged = onLocationChanged;
		}

		function onScreenClick() {
			$rootScope.$apply(function () {
				console.log('screen clicked');
			});
		}

		function onLocationChanged(lat, lon, alt) {
			$rootScope.$apply(function () {
				UserLocation.update(lon, lat, alt);
			});
		}

		/**
		 * Updates the POIs in the AR.
		 *
		 * Points have two states:
		 *
		 * * They can be in the AR or not.
		 *   This depends on the distance of the point from the current location of the user.
		 *   Only points that are close enough are added to the AR.
		 *
		 * * They can be visible or hidden.
		 *   This depends on user-selected filters.
		 *   Only points that match the currently selected filters will be visible;
		 *   the other points will still be in the AR, but they will be disabled and not show on the screen.
		 *
		 * The reason for these two states is that it is expensive to add or remove AR points,
		 * so we avoid that by simply showing/hiding them when the user changes filters but does not move.
		 */
		function updateAr() {

			// Ensure the data is loaded and the user is located.
			if (!Outing.hasOuting() || !UserLocation.hasLocation()) {
				return;
			}

			var timer = Timers.start();

			// Retrieve all available points.
			var allPois = Outing.getPois();
			$log.debug(allPois.length + ' points in total');

			// Determine the nearest points; those are the only points that should be in the AR.
			var nearestPois = getNearestPois(allPois);

			// Determine the visible points based on user-selected filters.
			// (Some of the nearest points might not be visible if they do not match the selected filters.)
			var visiblePois = Filters.filterPois(nearestPois);

			// We will keep track of applied changes.
			var changes = {
				visible: visiblePois
			};

			var newPoiIds        = _.map(nearestPois, getPoiId),
			    newVisiblePoiIds = _.map(visiblePois, getPoiId);

			// Remove points that are too far away from the AR.
			// Store the list of removed points.
			changes.removed = removeFarthestPois(newPoiIds);

			// Hide points that are in the AR but that do not match user-selected filters.
			var hidden = hideFilteredPois(newVisiblePoiIds);

			// Store the list of hidden points (this includes the points that we just removed from the AR).
			changes.hidden = changes.removed.concat(hidden);

			// Add new points not yet present in the AR.
			// Store the list of added points.
			changes.added = addNewPois(nearestPois, newPoiIds, newVisiblePoiIds);

			// Show points that were hidden in the AR but that should now be visible (e.g. because the user changed the current filters).
			var shown = showVisiblePois(newVisiblePoiIds);

			// Store the list of shown points (including points that were just added to the AR and that are visible).
			changes.shown = shown.concat(filterVisiblePois(changes.added, newVisiblePoiIds));

			timer.stop('load ' + newPoiIds.length + ' points in AR (' + newVisiblePoiIds.length + ' visible)');

			// Notify observers of changes.
			poisChangeSubject.onNext(changes);

			//AppActions.execute('toast', {message: changes.added.length + " points en plus, " + changes.removed.length + " points en moins"});
		}

		function getNearestPois(pois) {
			var timer = Timers.start();
			var nearest = _.filter(pois, isInReach);
			timer.stop('get ' + nearest.length + ' nearest pois');
			return nearest;
		}

		function removeFarthestPois(nearestPoiIds) {
			var timer = Timers.start();

			var removed = _.reduce(arPointsById, function (memo, arPoi, id) {
				if (!_.includes(nearestPoiIds, id)) {
					memo.push(removeArPoi(id));
				}

				return memo;
			}, []);

			timer.stop('remove ' + removed.length + ' farthest pois');
			return removed;
		}

		function hideFilteredPois(visiblePoiIds) {
			var timer = Timers.start();

			var hidden = _.reduce(arPointsById, function (memo, arPoi, id) {
				if (isArPoiVisible(arPoi) && !_.includes(visiblePoiIds, id)) {
					memo.push(setArPoiVisible(arPoi, false).poi);
				}

				return memo;
			}, []);

			timer.stop('hide ' + hidden.length + ' filtered pois');
			return hidden;
		}

		function addNewPois(newPois, newPoiIds, newVisiblePoiIds) {
			var timer = Timers.start();

			var added = _.filter(newPois, function (poi) {
				if (!isInAr(poi)) {
					var visible = _.includes(newVisiblePoiIds, getPoiId(poi));
					addArPoi(poi, visible);
					return true;
				}
			});

			timer.stop('add ' + added.length + ' new pois');
			return added;
		}

		function showVisiblePois(newVisiblePoiIds) {
			var timer = Timers.start();

			var shown = _.reduce(newVisiblePoiIds, function (memo, id) {

				var arPoi = arPointsById[id];
				setArPoiOpacity(arPoi);//Update drawables

				if (!isArPoiVisible(arPoi)) {
					memo.push(setArPoiVisible(arPoi, true).poi);
				}

				return memo;
			}, []);

			timer.stop('show ' + shown.length + ' visible pois');
			return shown;
		}

		function filterVisiblePois(pois, visiblePoiIds) {
			return _.filter(pois, function (poi) {
				return _.includes(visiblePoiIds, getPoiId(poi));
			});
		}

		function isInReach(poi) {
			var distance = turf.distance(UserLocation.real, poi);
			return turf.distance(UserLocation.real, poi) * 1000 < reachLimit;
		}

		function isInAr(poi) {
			return !_.isNil(arPointsById[getPoiId(poi)]);
		}

		function isArPoiVisible(arPoi) {
			return arPoi.geoObject.enabled;
		}

		function setArPoiVisible(arPoi, visible) {
			arPoi.geoObject.enabled = visible;
			return arPoi;
		}

		function setArPoiOpacity(arPoi) {
			return arPoi.updateOpacity();
		}

		function onArPoiClick(arPoi) {
			return function onClick() {
				console.log('POI clicked', arPoi);
				var dist = arPoi.distanceToUser();
				console.log("distance to user ", dist);
				if (dist <= 20) {
					Outing.loadCurrentPoi(arPoi.poi);
				} else {
					AppActions.execute('toast', {message: "Vous êtes " + Math.round(dist - 20) + "m trop loin du point d'intérêt."});
				}
				return true; // Stop propagating the click event
			}
		}

		function addArPoi(poi, enabled) {
			var arPoi = new ArMarker(poi, enabled, onArPoiClick);
			arPointsById[getPoiId(poi)] = arPoi;
			return arPoi;
		}

		function removeArPoi(id) {

			var arPoi = arPointsById[id];
			if (!arPoi) {
				$log.warn('Could not find ArMarker to remove with id ' + JSON.stringify(id));
				return;
			}

			arPoi.remove();
			delete arPointsById[id];

			return arPoi.poi;
		}

		function getPoiId(poi) {
			// Important: must return a string as the resulting value is used both
			// in array and as object keys (it is automatically casted to a string
			// when used as an object key).
			return '' + poi.properties.id_poi;
		}

		/**
		 * Pausing the AR means disabling the camera and the sensors to spare resources and battery consumption.
		 * This should be the case whenever a fullscreen HTML is shown, effectively hiding the AR View from the user.
		 * To reactivate the AR, use the resumeAr function.
		 */
		function pauseAr() {
			$log.debug('Pausing the AR (camera and sensors)');
			AR.hardware.camera.enabled = false;
			AR.hardware.sensors.enabled = false;
		}

		/**
		 * Resuming the AR means enabling the camera and the sensors for the AR View to properly track and show the points.
		 * This function should be called after pauseAr has been executed. Calling it while the AR View is active would achieve nothing.
		 */
		function resumeAr() {
			$log.debug('Resuming the AR (sensors and camera)');
			AR.hardware.sensors.enabled = true;
			AR.hardware.camera.enabled = true;
		}
	}
})();
