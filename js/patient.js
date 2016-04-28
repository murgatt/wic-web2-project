var template = require("../templates/patient.html");
require("../styles/patient.css");

module.exports = function (ngModule) {
    var proxyNF = require("./NF.js")(ngModule);

    var controller = function (proxyNF, $scope, $mdDialog) {
        var ctrl = this;

        // Affectation d'un nouveau patient
        ctrl.affecterPatient = function () {
            var idInfirmier = ctrl.affecterPatient.infirmier != 0 ? ctrl.affecterPatient.infirmier : 'none';
            var patientNumber = ctrl.data.numero;
            proxyNF.affecterPatient(idInfirmier, patientNumber).then(function (data) {
                ctrl.cabinet.updateInfos();
                ctrl.cabinet.showAlert({
                    title: 'Patient affecté',
                    text: 'Le patient a bien été affecté'
                });
            }, function (data) {
                ctrl.cabinet.showAlert({
                    title: 'Erreur',
                    text: 'Le patient n\'a pas pu être affecté'
                });
            });
        }

        // Localiser l'adresse du patient sur une carte google
        ctrl.locatePatient = function () {
            var adresse = ctrl.data.adresse.numero + ', ' + ctrl.data.adresse.rue + ', ' + ctrl.data.adresse.codePostal + ', ' + ctrl.data.adresse.ville;
            proxyNF.locatePatient(adresse).then(function (data) {
                ctrl.showMap();
                var data = data.data;
                setTimeout(function () {
                    if (data.status == "OK" && data.results[0]) {
                        var x = data.results[0].geometry.location.lat;
                        var y = data.results[0].geometry.location.lng;
                        var map = new google.maps.Map(document.getElementById('map'), {
                            center: {
                                lat: x,
                                lng: y
                            },
                            zoom: 15
                        });
                        var marker = new google.maps.Marker({
                            position: {
                                lat: x,
                                lng: y
                            },
                        });
                        marker.setMap(map);
                        document.getElementById('map').style.visibility = "block";
                    } else {
                        document.getElementById('map').innerHTML = 'Erreur, impossible d\'afficher la carte pour cette adresse';
                    }
                }, 100);
            }, function (data) {
                ctrl.cabinet.showAlert({
                    title: 'Erreur',
                    text: 'Impossible de localiser cette adresse'
                });
            });
        }

        // Afficher le formulaire de modification d'un patient
        ctrl.showAlterForm = function (e) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: "templates/alterPatientForm.html",
                parent: angular.element(document.body),
                targetEvent: e,
                selectedIndex: 1,
                clickOutsideToClose: true
            });
        }

        // Supprimer un patient
        ctrl.deletePatient = function () {
            var confirm = $mdDialog.confirm()
                .title('Voulez-vous vraiment supprimer ce patient ?')
                .textContent('Vous êtes sur le point de supprimer ce patient. Etes-vous sûr de vouloir supprimer ce patient ?')
                .ariaLabel('Delete Patient Confirm')
                .ok('Oui')
                .cancel('Non');
            $mdDialog.show(confirm).then(function () {
                proxyNF.deletePatient(ctrl.data.numero).then(function (data) {
                    ctrl.cabinet.updateInfos();
                    ctrl.cabinet.showAlert({
                        title: 'Patient supprimé',
                        text: 'Le patient a bien été supprimé'
                    });
                }, function (data) {
                    ctrl.cabinet.showAlert({
                        title: 'Erreur',
                        text: 'Le patient n\'a pas pu être supprimé'
                    });
                });
            });


        }

        // Afficher la carte
        ctrl.showMap = function () {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: "templates/mapDialog.html",
                parent: angular.element(document.body),
                clickOutsideToClose: true
            });
        }

        // Dialog Controller
        function DialogController($scope, $mdDialog) {
            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            // Gestion des tabs
            $scope.max = 1;
            $scope.selectedIndex = 0;
            $scope.button = "Suivant";
            $scope.nextTab = function () {
                var index = ($scope.selectedIndex == $scope.max) ? 0 : $scope.selectedIndex + 1;
                $scope.selectedIndex = index;
                $scope.button = ($scope.selectedIndex == $scope.max) ? 'Précédent' : 'Suivant';;
            };

            // Initialiser les valeurs du formulaires de modifications
            $scope.newPatient = {
                patientName: ctrl.data.nom,
                patientForname: ctrl.data.prenom,
                patientNumber: ctrl.data.numero,
                patientSex: ctrl.data.sexe,
                patientBirthday: moment().toDate(ctrl.data.naissance),
                patientFloor: ctrl.data.adresse.etage,
                patientStreetNumber: ctrl.data.adresse.numero,
                patientStreet: ctrl.data.adresse.rue,
                patientPostalCode: ctrl.data.adresse.codePostal,
                patientCity: ctrl.data.adresse.ville
            };

            // Modifier le patient
            $scope.alterPatient = function () {
                $scope.newPatient.patientBirthday = moment($scope.newPatient.birthday).format('YYYY-MM-DD');
                proxyNF.alterPatient($scope.newPatient).then(function (data) {
                    ctrl.cabinet.updateInfos();
                    $mdDialog.hide();
                    ctrl.cabinet.showAlert({
                        title: 'Patient modifié',
                        text: 'Les informations du patient ont bien été modifiées'
                    });
                }, function (data) {
                    $mdDialog.hide();
                    ctrl.cabinet.showAlert({
                        title: 'Erreur',
                        text: 'Les informations du patient n\'ont pas pu être modifiées'
                    });
                });
            }
        }
    }

    ngModule.component("patient", {
        template: template,
        bindings: {
            data: '=',
            cabinet: '='
        },
        controller: controller
    });
};