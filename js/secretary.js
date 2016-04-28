require('../styles/secretary.css');

var angular = require("angular");
var angularMaterial = require("angular-material");
require("angular-material/angular-material.css");
var ngMessages = require('angular-messages')

var cabinetModule = angular.module("cabinet", [angularMaterial, 'ngMessages'])
    .config(function ($mdDateLocaleProvider) { // Configurer les valeurs en français pour le calendrier
        $mdDateLocaleProvider.months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        $mdDateLocaleProvider.shortMonths = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
        $mdDateLocaleProvider.days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        $mdDateLocaleProvider.shortDays = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
        $mdDateLocaleProvider.firstDayOfWeek = 1;
        $mdDateLocaleProvider.weekNumberFormatter = function (weekNumber) {
            return 'Semaine ' + weekNumber;
        };
        $mdDateLocaleProvider.msgCalendar = 'Calendrier';
        $mdDateLocaleProvider.msgOpenCalendar = 'Ouvrir le calendrier';
    });

require("./cabinetMedical.js")(cabinetModule);