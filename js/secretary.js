require('../styles/secretary.css');

var angular = require("angular");
var angularMaterial = require("angular-material");
require("angular-material/angular-material.css");
var ngMessages = require('angular-messages')

var cabinetModule = angular.module("cabinet", [angularMaterial, 'ngMessages'])
    .config(function ($mdDateLocaleProvider) {
        // Example of a French localization.
        $mdDateLocaleProvider.months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        $mdDateLocaleProvider.shortMonths = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
        $mdDateLocaleProvider.days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        $mdDateLocaleProvider.shortDays = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
        // Can change week display to start on Monday.
        $mdDateLocaleProvider.firstDayOfWeek = 1;
        // In addition to date display, date components also need localized messages
        // for aria-labels for screen-reader users.
        $mdDateLocaleProvider.weekNumberFormatter = function (weekNumber) {
            return 'Semaine ' + weekNumber;
        };
        $mdDateLocaleProvider.msgCalendar = 'Calendrier';
        $mdDateLocaleProvider.msgOpenCalendar = 'Ouvrir le calendrier';
    });

require("./cabinetMedical.js")(cabinetModule);