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
     * Creates a new Outing object, with the values passed a arguments.
     * The following properties will also be created with default values:
     * * status will be set to 'pending'
     * * added_at will be set to the current time and date
     * * nb_seen will be set to 0
     * * is_new will be set to true
     * @param created_by The name of the person who created the outing
     * @param id A number identifying the outing
     * @param name The title of the outing
     * @param date The date at which the outing is suppoed to take place
     * @param participant An object representing the participant data for this excursion
     * @param themes The themes of POI that should only be visible in this excursion
     * @param zones The path zones requested for this excursion
     * @constructor
     */
    function Outing(created_by, id, date, name, participant, themes, zones) {
      // TODO id de type number, valeur du status, valeur par défaut des dates
      this.created_by = created_by;
      this.id = id;
      this.date = date;
      this.name = name;
      this.participant = participant;
      this.themes = themes;
      this.zones = zones;
      this.status = status || 'pending';
      this.added_at = new Date();
      this.started_at = null;
      this.paused_at = null;
      this.finished_at = null;
      this.is_new = true;
    }

    /**
     * Creates a new Outing object, based on the data retrieved from the QR Code
     * @param qrCodeData Excursion data retrieved from the QR Code
     * @return {Outing}
     */
    Outing.fromQrCodeData = function(qrCodeData) {
      return new Outing(
        qrCodeData.creatorName,
        qrCodeData.id,
        qrCodeData.date,
        qrCodeData.name,
        qrCodeData.participant,
        qrCodeData.themes,
        qrCodeData.zones
      );
    };

    return Outing;
  }
})();