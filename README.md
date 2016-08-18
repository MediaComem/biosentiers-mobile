# BioSentiers



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



## Plugins installés

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



## Plateformes installées

Le projet est destiné à être utilisé sur des appareils Android et iOS. Ces deux plateformes ont dont été installées.
IMPORTANT ! Pour que le projet se compile sur Android avec le plugin Wikitude, la version 5.0.0 (au minimum) doit être, et a été, ajoutée.
