# BioSentiers

* [Installation](#installation)
* [Development](#development)
* [Conventions](#conventions)
  * [File structure](#file-structure)
  * [Style guide](#style-guide)
* [Cordova plugins](#cordova-plugins)
* [Ionic platforms](#ionic-platforms)



<a name="installation"></a>
## Installation

* Clone the repository.
* Install tools:
  * `npm install -g ionic ios-deploy gulp-cli`
* Install dependencies:
  * `cd /path/to/project`
  * `npm install`
  * `ionic hooks add`
* **Important**: several directories like `plugins` or `resources/android` are ignored. You must execute the following commands after a `git clone` to generate or download the missing files:
  * `ionic resources`
  * `ionic state restore`
* Add the Wikitude plugin's license key:
  * Change `this._sdkKey` in `/plugins/com.wikitude.phonegab.WikitudePlugin/www/WikitudePlugin.js`.
  * Change `this._sdkKey` in `/platforms/android/platform_www/plugins/com.wikitude.phonegab.WikitudePlugin/www/WikitudePlugin.js` for Android.
  * Change `this._sdkKey` in `/platforms/ios/platform_www/plugins/com.wikitude.phonegab.WikitudePlugin/www/WikitudePlugin.js` for iOS.



<a name="development"></a>
## Development

[Gulp](http://gulpjs.com) tasks are provided to make your life easier.

The default task, launched by typing `glup` in a terminal in the project's directory,
executes most useful development tasks in one go.
It runs the `compile`, `inject` and `watch` tasks that are described below.

### Compilation tasks

* `gulp sass` - Compiles [Sass](http://sass-lang.com) files in the `scss` directory and saves them in `www/css`.
* `gulp compile` - Alias of the previous task.

### Injection tasks

The [gulp-inject](https://www.npmjs.com/package/gulp-inject) plugin is used to automatically include CSS and JS files in the application's HTML pages.

**Note:** this only works for application files added by developers,
not files of third-party libraries like Lodash, Turf or Leaflet.
Those must still be added manually.

* `gulp inject:app` - Lists CSS and JS files in `www/app` and automatically injects the corresponding `<link>` and `<script>`
  tags in `www/index.html`, where the `<!-- inject:css -->` and `<!-- inject:js -->` comments are.
* `gulp inject:wikitude` - Lists CSS and JS files in `www/wikitude-worlds` and automatically injects the corresponding `<link>` and `<script>`
  tags in `www/wikitude-worlds/main/index.html`, where the `<!-- inject:css -->` and `<!-- inject:js -->` are.
* `gulp inject` - Executes the two above tasks.

[Here's an example of the result.](https://github.com/MediaComem/biosentiers/blob/182665209fe0fa219fa8a3191a4bf6efa8ab6740/www/wikitude-worlds/main/index.html#L34-L61)

### Automated tasks

To avoid manually launching the above tasks every time a file is added, modified and deleted, the following tasks are provided.

* `gulp watch:app` - Observes additions and deletions of CSS and JS files in the `www/app`
  directory and updates injections in `www/index.html` in real time.
* `gulp watch:wikitude` - Observes additions and deletions of CSS and JS files in the `www/wikitude-worlds`
  directory and updates injections in `www/wikitude-worlds/main/index.html` in real time.
* `gulp watch:sass` - Observes the Sass files in the `scss` directory and automatically compiles them into `www/css` in real time.
* `gulp watch` - Executes the three above tasks in parallel.

**Note:** these tasks keep executing until they are stopped with Ctrl-C.



<a name="conventions"></a>
## Conventions

<a name="file-structure"></a>
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

<a name="style-guide"></a>
### Style guide

* All Angular components (controllers, services, directives, etc) should be wrapped in
  an [Immediately-Invoked Function Expression (IIFE)](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression) to avoid polluting the global scope:

  ```js
  (function() {
    // Angular module, controller, service or directive here...
  })();
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

* All Angular components should be defined in a named function, not an anonymous function:

  ```js
  angular
    .module('my-module')
    .controller(MyCtrl);

  function MyCtrl($scope) {
    // ...
  }
  ```

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



<a name="cordova-plugins"></a>
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



<a name="ionic-platforms"></a>
## Ionic platforms

This project is meant to be used on Android and iOS devices; those are the Ionic platforms that are installed.

**Important:** Android version 5.0.0 or higher is required for the Wikitude plugin to work.
