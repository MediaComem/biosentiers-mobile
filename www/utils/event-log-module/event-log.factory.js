(function() {
  'use strict';
  angular
    .module('event-log-module')
    .constant('MIN_DISTANCE', 10)
    .factory('EventLogFactory', EventLogFactoryFn);

  /*
   * Factory that stores and returns new EventLog object corresponding to the property that is accessed.
   * Depending on the event that needs to be created, the factory function could need additionnal argument. Please check each function signature.
   */
  function EventLogFactoryFn(MIN_DISTANCE, EventLog, $state, $log, turf) {
    var TAG          = "[EventLogFactory] ",
        prevPosition = null;
    return {
      location  : function(context, excursionId, position) {
        if (minDistanceMoved(position)) {
          return new EventLog('location', {
            excursionId: excursionId,
            position   : {
              latitude : position.latitude,
              longitude: position.longitude,
              altitude : position.altitude,
              accuracy : position.accuracy
            },
            context    : context
          });
        } else { return null; }
      },
      app       : {
        started: function() { return new EventLog('app.started'); },
        paused : function() { return new EventLog('app.paused'); },
        resumed: function() { return new EventLog('app.resumed'); }
      },
      ar        : {
        launched: function() { return new EventLog('ar.launched'); },
        quitted : function() { return new EventLog('ar.quitted'); },
      },
      network   : {
        offline: function() { return new EventLog('network.offline'); },
        online : function(connectionType) { return new EventLog('network.online', {connectionType: connectionType}); }
      },
      navigation: {
        menuOpen      : function() {
          return new EventLog('navigation.menuOpen', {
            fromState: {
              url : $state.current.url,
              name: $state.current.name
            }
          });
        },
        connect       : function() { return new EventLog('navigation.connect'); },
        excursionsList: function(tab) {
          return new EventLog('navigation.excursionsList.' + tab, {
            tab  : tab,
            state: {
              url : $state.current.url,
              name: $state.current.name
            }
          });
        },
        excursion     : {
          card    : function(excursion) {
            return new EventLog('navigation.excursion.card', {
              id    : excursion.serverId,
              status: excursion.status
            });
          },
          seenPois: {
            list: function(excursion) {
              return new EventLog('navigation.excursion.seenPois.list', {
                excursion: {
                  id    : excursion.serverId,
                  status: excursion.status
                }
              });
            },
            card: function(specieId) { return new EventLog('navigation.excursion.seenPois.card', {specieId: specieId}); }
          }
        }
      },
      excursion : {
        contextMenu  : function() { return new EventLog('excursion.contextMenu')},
        created      : function(excursion) {
          return new EventLog('excursion.created', {
            excursion: {
              id     : excursion.serverId,
              addedAt: excursion.addedAt
            }
          });
        },
        archived     : function(excursion) {
          return new EventLog('excursion.archived', {
            excursion: {
              id     : excursion.serverId,
              addedAt: excursion.addedAt
            }
          });
        },
        restored     : function(excursion) {
          return new EventLog('excursion.restored', {
            excursion: {
              id        : excursion.serverId,
              addedAt   : excursion.addedAt,
              archivedAt: excursion.archivedAt,
            }
          });
        },
        deleted      : function(excursion) {
          return new EventLog('excursion.deleted', {
            excursion: {
              id        : excursion.serverId,
              addedAt   : excursion.addedAt,
              archivedAt: excursion.archivedAt,
            }
          });
        },
        reinitialized: function(excursion) {
          return new EventLog('excursion.reinitialized', {
            excursion: {
              id        : excursion.serverId,
              addedAt   : excursion.addedAt,
              startedAt : excursion.startedAt,
              finishedAt: excursion.finishedAt
            }
          });
        },
        flaggedAsNew    : function(excursion) {
          return new EventLog('excursion.flaggedAsNew', {
            excursion: {
              id     : excursion.serverId,
              addedAt: excursion.addedAt
            }
          });
        },
        unflaggedAsNew  : function(excursion) {
          return new EventLog('excursion.unflaggedAsNew', {
            excursion: {
              id     : excursion.serverId,
              addedAt: excursion.addedAt
            }
          });
        },
        started      : function(excursion) {
          return new EventLog('excursion.started', {
            excursion: {
              id     : excursion.serverId,
              addedAt: excursion.addedAt
            }
          });
        },
        paused       : function(excursion) {
          return new EventLog('excursion.paused', {
            excursion: {
              id       : excursion.serverId,
              addedAt  : excursion.addedAt,
              startedAt: excursion.startedAt,
            }
          });
        },
        resumed      : function(excursion) {
          return new EventLog('excursion.resumed', {
            excursion: {
              id       : excursion.serverId,
              addedAt  : excursion.addedAt,
              startedAt: excursion.startedAt,
              pausedAt : excursion.pausedAt,
            }
          });
        },
        finished     : function(excursion) {
          return new EventLog('excursion.finished', {
            excursion: {
              id       : excursion.serverId,
              addedAt  : excursion.addedAt,
              startedAt: excursion.startedAt,
            }
          });
        },
      },
      action    : {
        scanQr         : {
          new      : function(excursion) {
            return new EventLog('actions.scanQr.new', {
              excursionId  : excursion.serverId,
              participantId: excursion.participant.id
            });
          },
          different: function(excursion, existingExcursions) {
            return new EventLog('actions.scanQr.different', {
              excursionId         : excursion.serverId,
              participantId       : excursion.participant.id,
              existingParticipants: existingExcursions.map(function(existingExcursion) {
                return existingExcursion.participant.id;
              })
            });
          },
          identical: function(excursion) {
            return new EventLog('actions.scanQr.identical', {
              excursionId  : excursion.serverId,
              participantId: excursion.participant.id
            });
          }
        },
        excursionsList : {
          excursionActionSheet: function(excursion) {
            return new EventLog('action.excursionsList.excursionActionSheet', {
              excursion: {
                id    : excursion.serverId,
                status: excursion.status
              }
            })
          },
          contextMenu         : function() { return new EventLog('action.excursionsList.contextMenu')},
          archives            : {
            showed: function() { return new EventLog('action.excursionsList.archives.showed'); },
            hidden: function() { return new EventLog('action.excursionsList.archives.hidden'); }
          }
        },
        positionWatcher: {
          activated  : function() { return new EventLog('action.positionWatcher.activated'); },
          deactivated: function() { return new EventLog('action.positionWatcher.deactivated'); }
        },
        filters        : {
          opened : function(excursionId, selectedFilters) {
            return new EventLog('action.filters.opened', {
              excursionId   : excursionId,
              currentFilters: selectedFilters
            });
          },
          changed: function(excursionId, selectedFilters) {
            return new EventLog('action.filters.changed', {
              excursionId: excursionId,
              newFilters : selectedFilters
            });
          }
        },
        bigmap         : {
          opened: function(excursionId) { return new EventLog('action.bigmap.opened', {excursionId: excursionId}); },
          center: {
            onTrail: function(excursionId) { return new EventLog('action.bigmap.center.onTrail', {excursionId: excursionId}); },
            onUser : function(excursionId) { return new EventLog('action.bigmap.center.onUser', {excursionId: excursionId}); }
          },
          closed: function(excursionId) { return new EventLog('action.bigmap.closed', {excursionId: excursionId}); }
        },
        ar             : {
          poi: {
            clicked: function() {

            },
            checked: function() {

            },
            closed : function() {

            }
          },
          end: {
            reached  : function() {

            },
            validated: function() {

            },
            refused  : function() {

            },
            manual   : function() {

            }
          }
        }
      }
    };

    /**
     * Check that the given position is far enough from the previous one to be logged.
     * @param {Object} position - The new position.
     * @param {Number} position.longitude - The position's longitude, in degrees.
     * @param {Number} position.latitude - The position's latitude, in degrees.
     * @return {Boolean} True if the new position is far enough, False if not.
     */
    function minDistanceMoved(position) {
      var res = true;
      if (prevPosition) {
        var distance = turf.distance(turf.helpers.point([prevPosition.longitude, prevPosition.latitude]), turf.helpers.point([position.longitude, position.latitude])) * 1000;
        res = distance >= MIN_DISTANCE;
      }
      prevPosition = position;
      return res;
    }
  }
})();
