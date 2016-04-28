var template = require("../templates/patient.html");
require("../styles/patient.css");

module.exports = function (ngModule) {
    var proxyNF = require("./NF.js")(ngModule);

    var controller = function (proxyNF, $scope, $mdDialog) {
        var ctrl = this;
        
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
        
        ctrl.locatePatient = function () {
            var adresse = ctrl.data.adresse.numero + ', ' + ctrl.data.adresse.rue + ', ' + ctrl.data.adresse.codePostal + ', ' + ctrl.data.adresse.ville;
            proxyNF.locatePatient(adresse).then(function (data){
                ctrl.showMap();
                var data = data.data;
                setTimeout(function(){
                    if(data.status == "OK" && data.results[0]) {
                        console.log(data);
                        var x = data.results[0].geometry.location.lat;
                        var y = data.results[0].geometry.location.lng;
                        var map = new google.maps.Map(document.getElementById('map'), {
                            center: {lat: x, lng: y},
                            zoom: 15
                        });
                        var marker=new google.maps.Marker({
                            position:{lat: x, lng: y},
                        });
                        marker.setMap(map);
                        document.getElementById('map').style.visibility="block";
                    }
                    else {
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