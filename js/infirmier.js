var template = require("../templates/infirmier.html");
require("../styles/infirmier.css");

module.exports = function (ngModule) {
    require("./patient.js")(ngModule);

    var controller = function () {
        var ctrl = this;
        ctrl.cabinet.updateInfos();
    }

    ngModule.component("infirmier", {
        template: template,
        bindings: {
            data: '=',
            cabinet: '='
        },
        controller: controller
    });
};