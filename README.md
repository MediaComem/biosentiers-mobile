# BioSentiers

* [Installation](#installation)
* [Développement](#development)
* [Plugins Cordova installés](#cordova-plugins)
* [Plateformes Ionic installées](#ionic-platforms)



<a name="installation"></a>
## Installation

* Cloner le repository.
* Installer les outils:
  * `npm install -g ionic ios-deploy gulp-cli`
* Installer les dépendances:
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

Des tâches [Gulp](http://gulpjs.com) sont fournies pour simplifier le développement.

La tâche par défaut, lancée en tapant `gulp` dans le terminal depuis le dossier du projet,
permet d'exécuter en une fois la plupart des tâches utiles pour le développement.
Elle exécute les tâches `compile`, `inject` et `watch` qui sont décrites ci-dessous.

### Tâches de compilation

* `gulp sass` - Compile les fichiers [Sass](http://sass-lang.com) présents dans le dossier `scss` et les sauve dans le dossier `www/css`.
* `gulp compile` - Alias de la tâche ci-dessus.

### Tâches d'injection

Le plugin [gulp-inject](https://www.npmjs.com/package/gulp-inject) est utilisé pour automatiquement inclure les fichiers CSS
et JS de l'application dans les pages HTML.

**Note:** ceci concerne uniquement les fichiers écrits par les développeurs,
et pas les fichiers des librairies externes ajoutées au projet (par exemple Lodash, Turf ou Leaflet).
Ces derniers doivent toujours être ajoutées manuellement.

* `gulp inject:app` - Liste les fichiers CSS et JS dans le dossier `www/app` et injecte automatiquement les balises `<link>` et `<script>`
  nécessaires dans le fichier `www/index.html`, là où se trouvent les commentaires `<!-- inject:css -->` et `<!-- inject:js -->`.
* `gulp inject:wikitude` - Liste les fichiers CSS et JS dans le dossier `www/wikitude-worlds` et injecte automatiquement les balises `<link>` et `<script>`
  nécessaires dans le fichier `www/wikitude-worlds/main/index.html`, là où se trouvent les commentaires `<!-- inject:css -->` et `<!-- inject:js -->`..
* `gulp inject` - Exécute les deux tâches ci-dessus.

[Voici un exemple du résultat.](https://github.com/MediaComem/biosentiers/blob/182665209fe0fa219fa8a3191a4bf6efa8ab6740/www/wikitude-worlds/main/index.html#L34-L61)

### Tâches automatiques

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
