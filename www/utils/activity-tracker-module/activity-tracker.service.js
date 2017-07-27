/**
 * Created by Mathias Oberson on 10.02.2017.
 */
(function() {
  'use strict';
  angular
    .module('activity-tracker-module')
    .service('ActivityTracker', ActivityTrackerService);

  function ActivityTrackerService($cordovaFile, $q) {
    var dirName  = 'ActivityTracker',
        fileName = dirName + '/' + todayFileName(),
        log,
        service  = {
          log  : logFn,
          debug: debugFn,
          reset: resetFn
        };

    return service;

    ////////////////////

    function logFn(content) {
      console.log('AT log from service');
      log = {
        timestamp: Date.now(),
        content  : content
      };
      $q.when()
        .then(checkLogDir)
        .then(createOrAppendToFile)
        .catch(function(error) {
          console.error(error);
          return error;
        })
    }

    function createOrAppendToFile() {
      return $q(function(resolve, reject) {
        $cordovaFile.checkFile(cordova.file.dataDirectory, fileName)
          .then(function(file) {
            console.log('AT file exists!');
            resolve(appendToFile());
          })
          .catch(function(result) {
            if (result.code === 1) {
              console.log('AT need to create log file', fileName);
              resolve(createLogFile());
            } else {
              console.log('AT some other error');
              reject(result);
            }
          });
      })
    }

    function checkLogDir() {
      return $q(function(resolve, reject) {
        $cordovaFile.checkDir(cordova.file.dataDirectory, dirName)
          .then(function(success) {
            console.log('AT dir exists', success);
            resolve(success);
          })
          .catch(function(result) {
            if (result.code === 1) {
              console.log('AT dir not exists');
              $cordovaFile.createDir(cordova.file.dataDirectory, dirName)
                .then(function(success) {
                  console.log('AT dir created');
                  resolve(success);
                })
                .catch(function(error) {
                  console.log('AT dir error');
                  reject(error);
                })
            } else {
              console.log('AT dir error');
              reject(result);
            }
          })
      })
    }

    function createLogFile() {
      return $cordovaFile.writeFile(cordova.file.dataDirectory, fileName, JSON.stringify(log), false)
        .then(function(success) {
          console.log('AT write file OK', success);
        })
        .catch(function(error) {
          console.error('AT writing failed!', error);
          return error;
        })
    }

    function appendToFile() {
      return $cordovaFile.writeExistingFile(cordova.file.dataDirectory, fileName, "," + JSON.stringify(log), false)
        .then(function(success) {
          console.log('AT writing existing file OK', success);
        })
        .catch(function(error) {
          console.log('AT writing failed!', error);
          return error;
        })
    }

    function debugFn() {
      return $q.when()
        .then(getAllLogNames)
        .then(function(logNames) {
          console.log('AT', logNames);
          for (log of logNames) {
            readFileContent(log);
          }
        })
        .catch(function(error) {
          console.error('AT', error);
        })
    }

    function readFileContent(fileName) {
      return $q(function(resolve, reject) {
        console.log('AT debug from service');
        console.log('AT paths', cordova.file.dataDirectory, fileName);
        $cordovaFile.readAsText(cordova.file.dataDirectory, fileName)
          .then(function(success) {
            success = JSON.parse("[" + success + "]");
            console.log('AT log file content', success);
            resolve(success);
          })
          .catch(function(error) {
            console.log('AT read error', error);
            reject(error);
          })
      })
    }

    function getAllLogNames() {
      return $q(function(resolve, reject) {
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory + "/" + dirName,
          function(dirEntry) {
            var dirReader = dirEntry.createReader();
            dirReader.readEntries(function(files) {
              var fileNames = [];
              console.log('AT files', files);
              for (var i = 0; i < files.length; i++) {
                console.log('AT', files[i], files[i].name);
                fileNames.push(dirName + '/' + files[i].name);
              }
              resolve(fileNames);
            }, function(error) {
              console.error('AT', error);
              reject(error);
            })
          }, function(error) {
            console.error('AT', error);
            reject(error);
          });
      })
    }

    function resetFn() {
      $cordovaFile.removeRecursively(cordova.file.dataDirectory, dirName)
        .then(function(success) {
          console.log('AT all logs deleted', success);
        })
        .catch(function(error) {
          console.log('AT reset error', error);
        })
    }

    /**
     * Constructs the today log file name and returns it.
     * @return {string} A string with the format YYYY-MM-DD.txt
     */
    function todayFileName() {
      var date  = new Date(),
          year  = date.getFullYear(),
          month = date.getMonth(),
          day   = date.getDate();

      if (month < 10) month = [0] + month;
      if (date < 10) day = [0] + day;

      return year + '-' + month + '-' + day + '.txt';
    }
  }
})();
