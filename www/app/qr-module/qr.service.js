/**
 * Created by Mathias on 31.03.2016.
 */
(function() {
  'use strict';

  angular
    .module('qr-module')
    .factory('QR', QRService);

  function QRService($log) {

    var TAG     = "[QR] ",
        service = {
          getExcursionData: getExcursionData
        };

    return service;

    ////////////////////

    /**
     * Returns the data for the excursion, based on the data retrieved from the QR Code
     * @param qrCodeData
     * @return {excursion|{creatorName, id, date, name, participant, types, zones}|*}
     */
    function getExcursionData(qrCodeData) {
      $log.log(TAG + 'QR code raw data', qrCodeData);
      var decodedData = bioqr.decode(qrCodeData.text, {format: 'numeric'});
      switch (decodedData.version) {
        case 1:
          return fromVers1(decodedData)
      }
    }

    /**
     * Get the excursion data from a v1 decoded QR Code
     * @param decodedData Data decoded from a v1 QR Code
     * @return {excursion|{creatorName, id, date, name, participant, types, zones}|*}
     */
    function fromVers1(decodedData) {
      return decodedData.excursion;
    }
  }
})();
