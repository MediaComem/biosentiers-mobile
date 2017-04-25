/**
 * Created by Mathias Oberson on 07.02.2017.
 * -----------------------------------------
 * This service is a class representing an Outing object as manipulated by the local database.
 * Whenever some code wants to used Outing data object, it should do so by manipulating an instance of this class.
 * You can either create an Outing object with its raw data using the constructor,
 * or by using the static createFromObject factory method (like when fetchning data from LokiJS)
 */
(function() {
  'use strict';
  angular
    .module('outings-module')
    .service('OutingClass', OutingClass);

  function OutingClass() {
    /**
     * Creates a new Outing object
     * @param id A number identifying the outing
     * @param name The title of the outing
     * @param status The status of an outing can only be 'pending', 'ongoing', 'finished'
     * @param created_by The name of the person who created the outing
     * @param date The date at which the outing is suppoed to take place
     * @param created_at The date at which the outing has been created
     * @param started_at (Optionnal) The date at which the outing has been started
     * @param paused_at (Optionnla) The date at which the outing has been paused
     * @param finished_at (Optionnal) The date at which the outing has been finished
     * @param nb_seen {Number} (Optionnal) The number of POIs that have been seen in the context of this Outing. Default value : 0
     * @constructor
     */
    function Outing(id, name, status, created_by, date, created_at, started_at, paused_at, finished_at, nb_seen) {
      // TODO id de type number, valeur du status, valeur par défaut des dates
      this.id = id;
      this.name = name;
      this.status = status;
      this.date = date;
      this.created_by = created_by;
      this.created_at = created_at;
      this.started_at = started_at;
      this.paused_at = paused_at;
      this.finished_at = finished_at;
      this.nb_seen = nb_seen || 0;
    }

    return Outing;
  }
})();