var proxyNF = function ($http) {

    this.getData = function (src) {
        return $http.get(src).then(processData);
    }

    this.addPatient = function (patient) {
        return $http.post('/addPatient', patient);
    }
    
    this.test = function() {
        console.log('wsh');
    }
    
    this.affecterPatient = function (idInfirmier, patientNumber) {
        var data = {
            infirmier: idInfirmier,
            patient: patientNumber
        }
        return $http.post('/affectation', data);
    }
    
    this.locatePatient = function (adresse) {
        var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+adresse+"&key=AIzaSyAebJt3SWyasM_PUHoMHreHZhxWF7vxhBo";
        return $http.get(url);
    }
}
// AJETER ?
proxyNF.$inject = ["$http"]; // Injection de dépendances

module.exports = function (ngModule) {
    var id = "proxyNF";
    ngModule.service(id, proxyNF);
    return id;
};

function processData(response) {

    var parser = new DOMParser();
    var xml = parser.parseFromString(response.data, "text/xml");
    
    var cabinet = {
        patientsRestant: [],
        infirmiers: {}
    }
    
    var infirmiers = {};
    
    var infirmiersXML = xml.querySelectorAll('infirmier');
    for(var i = 0; i < infirmiersXML.length; i++) {
        var id = infirmiersXML[i].getAttribute('id');
        var nom = infirmiersXML[i].querySelector('nom').textContent;
        var prenom = infirmiersXML[i].querySelector('prenom').textContent;
        var photo = infirmiersXML[i].querySelector('photo').textContent;
        var infirmier = new Infirmier(id, nom, prenom, photo);
        infirmiers[id] = infirmier;
    }
    
    var patientsRestant = [];
    
    var patientsXML = xml.querySelectorAll('patient');
    for(var i = 0; i < patientsXML.length; i++) {
        var nom = patientsXML[i].querySelector('nom').textContent;
        var prenom = patientsXML[i].querySelector('prenom').textContent;
        var sexe = patientsXML[i].querySelector('sexe').textContent;
        var naissance = patientsXML[i].querySelector('naissance').textContent;
        var numero = patientsXML[i].querySelector('numero').textContent;
        var adresseXML = patientsXML[i].querySelector('adresse');
        var etage = adresseXML.querySelector('etage');
        etage = etage ? etage.textContent : null;
        var numeroRue = adresseXML.querySelector('numero');
        numeroRue = numeroRue ? numeroRue.textContent : null;
        var rue = adresseXML.querySelector('rue').textContent;
        var ville = adresseXML.querySelector('ville').textContent;
        var codePostal = adresseXML.querySelector('codePostal').textContent;
        var adresse = new Adresse(etage, numeroRue, rue, ville, codePostal);        
        var patient = new Patient(nom, prenom, sexe, naissance, numero, adresse);
        if(patientsXML[i].querySelector('visite').getAttribute('intervenant')) {
            var intervenant = patientsXML[i].querySelector('visite').getAttribute('intervenant');
            infirmiers[intervenant].patients.push(patient);
        }
        else {
            patientsRestant.push(patient);
        }
    }
    
    var cabinet = {
        patientsRestant: patientsRestant,
        infirmiers: infirmiers
    }
    
    return cabinet;

}

function Infirmier(id, nom, prenom, photo) {
    this.id         = id;
    this.nom        = nom;
    this.prenom     = prenom;
    this.photo      = photo;
    this.patients   = [];
}

function Patient(nom, prenom, sexe, naissance, numero, adresse) {
    this.nom        = nom;
    this.prenom     = prenom;
    this.sexe       = sexe;
    this.naissance  = naissance;
    this.numero     = numero;
    this.adresse    = adresse;
}


function Adresse(etage, numero, rue, ville, codePostal) {
    this.etage = etage;
    this.numero = numero;
    this.rue = rue;
    this.ville = ville;
    this.codePostal = codePostal;
}