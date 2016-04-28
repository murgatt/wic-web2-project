var template = require("../templates/cabinetMedical.html");
require("../styles/cabinetMedical.css");

module.exports = function (ngModule) {

    var proxyNF = require("./NF.js")(ngModule);
    require("./infirmier.js")(ngModule);

    var controller = function (proxyNF, $scope, $mdDialog) {
            var ctrl = this;
            ctrl.data = {};
            proxyNF.getData(this.src).then(function (data) {
                ctrl.data = data;
            });

            ctrl.displayForm = function(e) {
                $mdDialog.show({
                        controller: DialogController,
                        templateUrl: "templates/patientForm.html",
                        parent: angular.element(document.body),
                        targetEvent: e,
                        selectedIndex: 1,
                        clickOutsideToClose: true
                    });
            }
            
            ctrl.updateInfos = function () {
                proxyNF.getData(this.src).then(function (data) {
                    ctrl.data = data;
                });
            }
            
            ctrl.showAlert = function (content) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('body')))
                    .clickOutsideToClose(false)
                    .title(content.title)
                    .textContent(content.text)
                    .ariaLabel('Alert Infos Dialog')
                    .ok('Ok')
                );
            }
            
            // Dialog Controller
            function DialogController($scope, $mdDialog) {
                $scope.hide = function () {
                    $mdDialog.hide();
                };
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
                $scope.max = 1;
                $scope.selectedIndex = 0;
                $scope.button = "Suivant";
                $scope.nextTab = function () {
                    var index = ($scope.selectedIndex == $scope.max) ? 0 : $scope.selectedIndex + 1;
                    $scope.selectedIndex = index;
                    $scope.button = ($scope.selectedIndex == $scope.max) ? 'Précédent' : 'Suivant';;
                };

                $scope.addPatient = function() {
                    proxyNF.addPatient($scope.newPatient).then(function (data) {
                        ctrl.updateInfos();
                        $mdDialog.hide();
                        ctrl.showAlert({
                            title: 'Patient ajouté',
                            text: 'Le patient a bien été ajouté au cabinet médical'
                        });
                    }, function (data) {
                        $mdDialog.hide();
                        ctrl.showAlert({
                            title: 'Erreur',
                            text: 'Le patient n\'a pas pu être ajouté'
                        });
                    });
                }
            }

        }
        //controller.$inject = [ proxyNF ]; // Injection de dépendances

    ngModule.component("cabinetMedical", {
        template: template,
        bindings: {
            titre: "@",
            src: "@"
        },
        controller: controller
    });
};