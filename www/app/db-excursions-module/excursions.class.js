/**
 * Created by Mathias Oberson on 07.02.2017.
 * -----------------------------------------
 * This service is a class representing an Excursion object as manipulated by the local database.
 * Whenever some code wants to used Excursion data object, it should do so by manipulating an instance of this class.
 * You can either create an Excursion object with its raw data using the constructor,
 * or by using the static createFromObject factory method (like when fetchning data from LokiJS)
 */
(function() {
  'use strict';
  angular
    .module('db-excursions-module')
    .service('ExcursionClass', ExcursionClass);

  function ExcursionClass() {
    /**
     * Creates a new Excursion object, with the values passed a arguments.
     * The following properties will also be created with default values:
     * * app_id (which identify this excursion with this participant on the app) will concatenate the server_id value and the participant.id value with a "-"
     * * status will be set to 'pending'
     * * added_at will be set to the current time and date
     * * nb_seen will be set to 0
     * * is_new will be set to true
     * @param created_by The name of the person who created the excursion
     * @param server_id A number identifying the excursion on the server
     * @param name The title of the excursion
     * @param date The date at which the excursion is suppoed to take place
     * @param participant An object representing the participant data for this excursion
     * @param themes The themes of POI that should only be visible in this excursion
     * @param zones The path zones requested for this excursion
     * @constructor
     */
    function Excursion(created_by, server_id, date, name, participant, themes, zones) {
      // TODO id de type number, valeur du status, valeur par défaut des dates
      this.created_by = created_by;
      this.server_id = server_id;
      this.date = date;
      this.name = name;
      this.participant = angular.copy(participant);
      this.themes = angular.copy(themes);
      this.zones = angular.copy(zones);
      this.status = status || 'pending';
      this.added_at = new Date();
      this.started_at = null;
      this.paused_at = null;
      this.finished_at = null;
      this.is_new = true;
      this.archived_at = null;
      this.app_id = this.server_id + "-" + this.participant.id;
    }

    /**
     * Creates a new Excursion object, based on the data retrieved from the QR Code
     * @param qrCodeData Excursion data retrieved from the QR Code
     * @return {Excursion}
     */
    Excursion.fromQrCodeData = function(qrCodeData) {
      return new Excursion(
        qrCodeData.creatorName,
        qrCodeData.id,
        qrCodeData.date,
        qrCodeData.name,
        qrCodeData.participant,
        qrCodeData.themes,
        qrCodeData.zones
      );
    };

    return Excursion;
  }
})();
