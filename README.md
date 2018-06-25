# BioSentiers

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [Development](#development)
  - [Compilation tasks](#compilation-tasks)
  - [Injection tasks](#injection-tasks)
  - [Automated tasks](#automated-tasks)
- [Conventions](#conventions)
  - [File structure](#file-structure)
  - [Style guide](#style-guide)
- [Cordova plugins](#cordova-plugins)
  - [BarcodeScanner](#barcodescanner)
  - [Wikitude](#wikitude)
  - [Cordova File](#cordova-file)
  - [Toast](#toast)
- [Ionic platforms](#ionic-platforms)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

* Clone the repository.
* Install tools:
  * `npm install -g cordova ionic ios-deploy gulp-cli`
* Install dependencies:
  * `cd /path/to/project`
  * `npm install`
* **Important**: several directories like `plugins` or `resources/android` are ignored. You must execute the following commands after a `git clone` to generate or download the missing files:
  * `ionic cordova prepare`
  * `ionic cordova resources`

    This command uses Ionic servers, so you need to be logged into your free Ionic account.
    You can log in beforehand with `ionic login`.
* Add the Wikitude plugin's license key:
  * Change `this._sdkKey` in `/plugins/com.wikitude.phonegab.WikitudePlugin/www/WikitudePlugin.js`.
  * Change `this._sdkKey` in `/platforms/android/platform_www/plugins/com.wikitude.phonegab.WikitudePlugin/www/WikitudePlugin.js` for Android.
  * Change `this._sdkKey` in `/platforms/ios/platform_www/plugins/com.wikitude.phonegab.WikitudePlugin/www/WikitudePlugin.js` for iOS.

## Downloading the data

The application data is not commited in this GitHub repository, and thus must be downloaded before working or installing the app.

To do so, use the dedicated gulp task `update-data` (see below).

This task will create the `data` directory and all its files.

## Development

[Gulp](http://gulpjs.com) tasks are provided to make your life easier.

The default task, launched by typing `glup` in a terminal in the project's directory, executes most useful development tasks in one go.
It runs the `compile`, `inject` and `watch` tasks that are described below.

### Compilation tasks

* `gulp sass` - Compiles [Sass](http://sass-lang.com) files in the `scss` directory and saves them in `www/css`.
* `gulp compile` - Alias of the previous task.

### Injection tasks

The [gulp-inject](https://www.npmjs.com/package/gulp-inject) plugin is used to automatically include CSS and JS files in the application's HTML pages.

**Note:** this only works for application files added by developers, not files of third-party libraries like Lodash, Turf or Leaflet. Those must still be added manually.

* `gulp inject:app` - Lists CSS and JS files in `www/app` and automatically injects the corresponding `<link>` and `<script>`
  tags in `www/index.html`, where the `<!-- inject:css -->` and `<!-- inject:js -->` comments are.
* `gulp inject:wikitude` - Lists CSS and JS files in `www/wikitude-worlds` and automatically injects the corresponding `<link>` and `<script>`
  tags in `www/wikitude-worlds/main/index.html`, where the `<!-- inject:css -->` and `<!-- inject:js -->` are.
* `gulp inject` - Executes the two above tasks.

[Here's an example of the result.](https://github.com/MediaComem/biosentiers/blob/182665209fe0fa219fa8a3191a4bf6efa8ab6740/www/wikitude-worlds/main/index.html#L34-L61)

### Automated tasks

To avoid manually launching the above tasks every time a file is added, modified and deleted, the following tasks are provided.

* `gulp watch:app` - Observes additions and deletions of CSS and JS files in the `www/app` directory and updates injections in `www/index.html` in real time.
* `gulp watch:wikitude` - Observes additions and deletions of CSS and JS files in the `www/wikitude-worlds` directory and updates injections in `www/wikitude-worlds/main/index.html` in real time.
* `gulp watch:sass` - Observes the Sass files in the `scss` directory and automatically compiles them into `www/css` in real time.
* `gulp watch` - Executes the three above tasks in parallel.

**Note:** these tasks keep executing until they are stopped with Ctrl-C.

### Misc task

* `gulp update-data` - Download all the trail and POI data (geographic or informative) with a call to the backend API. The received JSON is then manipulated and saved in adequates files and folders, all under the `data` directory, which will be created if not existing.
  **Call this task again at anytime to update the data with the latest version available in the backend database.**

## Conventions

### File structure

This projects contains 2 Angular applications, one in `www/app` and another in `www/wikitude-worlds/main`.
In each application, the file structure should be as follows:

* `index.html`
* `main.module.js`
* `about-page` (page example)
  * `about-page.module.js`
  * `about-page.controller.js`
  * `about-page.html`
  * `about-page.css`
* `mini-map-orientation` (directive example)
  * `mini-map-orientation.module.js`
  * `mini-map-orientation.directive.js`
  * `mini-map-orientation.template`
* `filters-modal` (modal example)
  * `filters-modal.module.js`
  * `filters-modal.controller.js`
  * `filters-modal.html`
  * `filters-modal.css`

The critical elements are:

* Each component of the application (page, directive, modal, etc) should be isolated in a **separate directory**.
* Each of those directories should define an **Angular module**, saved in a file with a name that ends with `.module.js`.
  This module should be added to the dependencies of the other modules that need it, or to your main application module.

### Style guide

* All Angular components (controllers, services, directives, etc) should be wrapped in
  an [Immediately-Invoked Function Expression (IIFE)](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression) to avoid polluting the global scope.
  You should also add `'use strict';` at the beginning of this function:

  ```js
  (function() {
    'use strict';

    // Angular module, controller, service or directive here...
  })();
  ```

* All Angular components should be defined in a named function, not an anonymous function:

  ```js
  angular
    .module('my-module')
    .controller(MyCtrl);

  function MyCtrl($scope) {
    // ...
  }
  ```

* All Angular components should have at least a comment on their main function definition to explain their purpose:

  ```js
  /**
   * This controller manages the filters modal dialog.
   *
   * It communicates with the Filters service to retrieve available choices,
   * and to update the currently selected filters in response to user changes.
   */
  function FiltersModalCtrl(Filters, $scope) {
    // ...
  }
  ```

* Angular components should be named as follows:

  * Controllers should end with `Ctrl`:

    ```js
    .controller('MapCtrl', MapCtrl)
    .controller('FiltersModalCtrl', FiltersModalCtrl)
    ```
  * Directives and services should have no suffix, although their definition function can:

    ```js
    .factory('Filters', FiltersService)
    .factory('Map', MapService)
    .directive('miniMapOrientation', MiniMapOrientationDirective)
    ```

* TODO: comments
* TODO: controller syntax
* TODO: no anonymous functions for events
* TODO: anonymous functions may be used if there are not too many

* Angular services should be defined as follows:

  ```js
  function SomeService($rootScope) {

    // Place private values here at the beginning of the service definition.
    // These values cannot be accessed outside this service.
    var value = 20;

    // Define the service structure next, with all public values and functions.
    var service = {
      publicValue: 30,
      doSomething: doSomething,
      doSomethingElse: doSomethingElse
    };

    // Plug into events here.
    $rootScope.$on('someEvent', function() {
      // ...
    });

    // Return the service.
    return service;

    // Define private and public service functions below.

    function doSomething() {
      return privateFunction();
    }

    function doSomethingElse(arg) {
      // ...
    }

    function privateFunction() {
      // ...
    }
  }
  ```

## Cordova plugins

### BarcodeScanner

https://github.com/Tazaf/phonegap-plugin-barcodescanner

This plugin opens a camera view to scan QR codes (and other kinds of codes).
It's a fork of the original plugin, correcting an Android authorization issue that conflicts with the Wikitude plugin.

### Wikitude

https://github.com/Tazaf/wikitude-ionic-plugin

This plugin provides the augmented reality view.
It's a fork of the original plugin with additional comments and logs to fix GPS issues
(the GPS continues to track the user even when the app is in the background).
Corrections are ongoing, all issues are not yet fixed.
The back button behavior also still has problems on Android.

### Cordova File

https://github.com/apache/cordova-plugin-file

This plugin allows to save files on the device's memory storage device.

### Toast

https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin

This plugin display "toasts" on the device to provide visual feedback messages to the user.

## Third party library

### Turf

[Turf][turf] is a JS library that helps making geographic calculations and manipulations; its documentation can be found [here][turf-doc].

The version included in the project is buit using the [turf-builder tool][tbt] with the followings modules:

* bbox
* distance
* helpers
* inside
* center

## Ionic platforms

This project is meant to be used on Android and iOS devices; those are the Ionic platforms that are installed.

**Important:** Android version 5.0.0 or higher is required for the Wikitude plugin to work.

[turf]:https://turfjs.org
[turf-doc]: http://turfjs.org/docs
[tbt]: https://turfjs-builder.herokuapp.com/
