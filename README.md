# BioSentiers

* [Installation](#installation)
* [Développement](#development)
* [Plugins Cordova installés](#cordova-plugins)
* [Plateformes Ionic installées](#ionic-platforms)



<a name="installation"></a>
## Installation

* Cloner le repository.
* Installer les dépendances:
  * `npm install -g ionic ios-deploy`
  * `cd /path/to/project`
  * `npm install`
  * `ionic hooks add`
* **Important**: le .gitignore de ce projet ne prend pas en compte plusieurs dossiers comme "plugins/" ou "resources/android/", il faut exécuter les commandes suivantes après un git clone pour qu'Ionic télécharge et génère les fichiers manquants:
  * `ionic resources`
  * `ionic state restore`
* Ajouter la clé de license du plugin Wikitude:
  * Changer `this._sdkKey` dans `/plugins/com.wikitude.phonegab.WikitudePlugin/www/WikitudePlugin.js`.
  * Changer `this._sdkKey` dans `/platforms/android/platform_www/plugins/com.wikitude.phonegab.WikitudePlugin/www/WikitudePlugin.js` pour Android.
  * Changer `this._sdkKey` dans `/platforms/ios/platform_www/plugins/com.wikitude.phonegab.WikitudePlugin/www/WikitudePlugin.js` pour iOS.



<a name="development"></a>
## Développement

Des tâches [Gulp](http://gulpjs.com) sont fournies pour simplifier le développement:
Les commandes suivantes peuvent être exécutées dans le terminal dans le dossier du projet.

**Compilation**

* `gulp sass` - Compile les fichiers [Sass](http://sass-lang.com) présents dans le dossier `scss` et les sauve dans le dossier `www/css`.
* `gulp compile` - Alias de la tâche ci-dessus.

**Injection**

Le plugin [gulp-inject](https://www.npmjs.com/package/gulp-inject) est utilisé pour automatiquement tenir à jour
la liste des fichiers CSS et JS de l'application.

* `gulp inject:app` - Liste les fichiers CSS et JS dans le dossier `www/app` et injecte automatiquement les balises `<link>` et `<script>`
  nécessaires dans le fichier `www/index.html`.
* `gulp inject:wikitude` - Liste les fichiers CSS et JS dans le dossier `www/wikitude-worlds` et injecte automatiquement les balises `<link>` et `<script>`
  nécessaires dans le fichier `www/wikitude-worlds/main/index.html`.
* `gulp inject` - Exécute les deux tâches ci-dessus.

**Auto compilation et injection**

Pour ne pas avoir à manuellement lancer les commandes précédentes à chaque ajout, modification ou suppression de fichier, les tâches suivantes sont disponibles.

**Note:** ces tâches continuent à s'exécuter tant qu'elles ne sont pas stoppées avec Ctrl-C.

* `gulp watch:app` - Observe les ajouts et suppressions de fichiers CSS et JS dans le dossier `www/app`
  et met à jour les injections du fichier `www/index.html` en temps réel.
* `gulp watch:wikitude` - Observe les ajouts et suppressions de fichiers CSS et JS dans le dossier `www/wikitude-worlds`
  et met à jour les injections du fichier `www/wikitude-worlds/main/index.html` en temps réel.
* `gulp watch:sass` - Observe les fichiers Sass dans le dossier `scss` et les compile automatiquement dans le dossier `www/css` en temps réel.
* `gulp watch` - Exécute les trois tâches ci-dessus en parallèle.



<a name="cordova-plugins"></a>
## Plugins Cordova installés

### BarcodeScanner

https://github.com/Tazaf/phonegap-plugin-barcodescanner

Ce plugin permet d'ouvrir une vue caméra pour scanner les QR codes (et autres types de codes).
Il s'agit d'un fork du plugin de base, corrigeant une autorisation Android qui créait un conflit avec le plugin Wikitude

### Wikitude

https://github.com/Tazaf/wikitude-ionic-plugin

Le plugin permettant de créer l'expérience de réalité augmentée.
Il s'agit d'un fork du plugin de base, contenant des commentaires et des logs dans le but de corriger le comportement erroné du tracker GPS, qui continue à tracker l'utilisateur, même lorsque l'app est en arrière-plan.
La correction est en cours, et le plugin ne réagit pas encore complètement comme il le devrait.
Il faudra aussi corriger le comportement problématique lors de l'utilisation du bouton "BACK" sur les appareils Android.

### Cordova File

https://github.com/apache/cordova-plugin-file

Ce plugin permet de sauvegarder des fichiers sur la mémoire de l'appareil.

### Toast

https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin

Ce plugin permet d'afficher des "toasts" sur l'appareil, donnant ainsi un retour, un message ou une information à l'utilisateur.



<a name="ionic-platforms"></a>
## Plateformes Ionic installées

Le projet est destiné à être utilisé sur des appareils Android et iOS. Ces deux plateformes ont dont été installées.
IMPORTANT ! Pour que le projet se compile sur Android avec le plugin Wikitude, la version 5.0.0 (au minimum) doit être, et a été, ajoutée.
