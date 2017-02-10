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
     *
     * @param id A number identifying the outing
     * @param name The title of the outing
     * @param status The status of an outing can only be 'pending', 'ongoing', 'finished'
     * @param created_by The name of the person who created the outing
     * @param date The date at which the outing is suppoed to take place
     * @param created_at The date at which the outing has been created
     * @param started_at (Optionnal) The date at which the outing has been started
     * @param paused_at (Optionnla) The date at which the outing has been paused
     * @param finished_at (Optionnal) The date at which the outing has been finished
     * @constructor
     */
    function Outing(id, name, status, created_by, date, created_at, started_at, paused_at, finished_at) {
      // TODO id de type number, valeur du status, valeur par défaut des dates
      this.id = id;
      this.name = name;
      this.status = status;
      this.created_by = created_by;
      this.date = date;
      this.created_at = created_at;
      this.started_at = started_at;
      this.paused_at = paused_at;
      this.finished_at = finished_at;
    }

    /**
     * Create an instance of Outing based on the given object. This object MUST have at least each proprty of an Outing instance.
     * See the documentation for the Outing constructor to have a list of the needed properties.
     * @param object The object from which an instance of Outing will be created
     * @return {Outing} The created instance of Outing
     */
    Outing.createFromObject = function(object) {
      return new Outing(object.id, object.name,  object.status, object.created_by, object.date, object.created_at, object.started_at, object.paused_at, object.finished_at);
    };

    /**
     * Sets the status property of the Outing to 'oingoing', and the started_at property to the current timestamp.
     */
    Outing.setOngoing = function(outing) {
      outing.status = 'ongoing';
      outing.started_at = Date.now();
    };

    /**
     * Sets the status property of the Outing to 'finished', and the finished_at property to the current timestamp.
     */
    Outing.setFinished = function(outing) {
      if (!outing.hasOwnProperty('status')) throw new TypeError("The given object doesn't appear to have a 'status' property. This is as requried property.");
      if (!outing.hasOwnProperty('finished_at')) throw new TypeError("The given object doesn't appear to have a 'finished_at' property. This is as requried property.");
      outing.status = 'finished';
      outing.finished_at = Date.now();
    };

    return Outing;
  }
})();