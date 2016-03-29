# BioSentiers

## IMPORTANT !

Puisque le .gitignore de ce projet ne prend pas en compte le dossier "plugins/" du projet Ionic, il fait exécuter la commande `ionic state restore` après un git clone pour qu'Ionic télécharge les plugins utilisés.

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