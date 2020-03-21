const urls = [
    {
        name: "StEtienne",
        url: "https://saint-etienne-gbfs.klervi.net/gbfs/en/station_information.json"
    },
    {
        name: "Lyon",
        url: "https://download.data.grandlyon.com/wfs/rdata?SERVICE=WFS&VERSION=1.1.0&outputformat=GEOJSON&request=GetFeature&typename=jcd_jcdecaux.jcdvelov&SRSNAME=urn:ogc:def:crs:EPSG::4171"
    },
    {
        name: "Rennes",
        url: "https://data.rennesmetropole.fr/api/records/1.0/search/?dataset=etat-des-stations-le-velo-star-en-temps-reel"
    },
    {
        name: "Montpellier",
        url: "https://data.montpellier3m.fr/sites/default/files/ressources/TAM_MMM_VELOMAG.xml"
    },
    {
        name: "Strasbourg",
        url: "http://velhop.strasbourg.eu/tvcstations.xml"
    }
];

//#region 
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
var convert = require('xml-js');
const fs = require('fs');
//#endregion

var stations = [];
class Station {
    constructor(id, name, position, capacity) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.capacity = capacity;
    };
    tostring(station) {
        return this.name + " has " + this.capacity + " available bicycles";
    }
};

Main = () => {
    for (let index = 0; index < responses.length; index++) {
    };
};


FormatStEtienne = response => {
    response = JSON.parse(response);
    console.table(response);
    let array = response.data.stations;
    for (let index = 0; index < array.length; index++) {
        let id = array[index].station_id;
        let name = array[index].name;
        let position = {
            lat: array[index].lat,
            lon: array[index].lon
        };
        let capacity = array[index].capacity;
        let station = new Station(id, name, position, capacity);
        stations.push(station);
    }
}

FormatLyon = response => {
    response = JSON.parse(response);
    let array = response.features;
    for (let index = 0; index < array.length; index++) {
        let id = array[index].properties.number;
        let name = array[index].properties.name;
        let position = {
            lat: array[index].properties.lat,
            lon: array[index].properties.lng
        };
        let capacity = array[index].properties.available_bike_stands;
        let station = new Station(id, name, position, capacity);
        stations.push(station);
    }
}

FormatRennes = response => {
    response = JSON.parse(response);
    console.table(response);
    let array = response.records;
    for (let index = 0; index < array.length; index++) {
        let id = array[index].fields.idstation;
        let name = array[index].fields.nom;
        let position = array[index].fields.coordonnees;
        let capacity = array[index].fields.nombrevelosdisponibles;
        let station = new Station(id, name, position, capacity);
        stations.push(station);
    }
}

FormatMontpellier = response => {
    let result = convert.xml2json(response, { compact: true, spaces: 4 });
    response = JSON.parse(result);
    console.table(response);
    let array = response.vcs.sl.si;
    for (let index = 0; index < array.length; index++) {
        let id = array[index]._attributes.id;
        let name = array[index]._attributes.na;
        let position = {
            lat: array[index]._attributes.la,
            lon: array[index]._attributes.lg
        };
        let capacity = array[index]._attributes.av;
        let station = new Station(id, name, position, capacity);
        stations.push(station);
    }
};

FormatStrasbourg = response => {
    let result = convert.xml2json(response, { compact: true, spaces: 4 });
    response = JSON.parse(result);
    console.table(response);
    const array = response.vcs.sl.si;
    for (let index = 0; index < array.length; index++) {
        let id = array[index]._attributes.id;
        let name = array[index]._attributes.na;
        let position = {
            lat: array[index]._attributes.la,
            lon: array[index]._attributes.lg
        };
        let capacity = array[index]._attributes.av;
        let station = new Station(id, name, position, capacity);
        stations.push(station);
    }
};

/**
 * Function that returns the data from the url. The data is unformatted
 */
callUrl = url => {
    xhr.open('GET', url, false);
    xhr.send(null);
    var response = xhr.responseText;
    return response;
};

/**
 * Function that go through all the url, get the data and call the functions that format
 */
getDataresponse = () => {
    for (let index = 0; index < urls.length; index++) {
        switch (urls[index].name) {
            case "StEtienne":
                FormatStEtienne(callUrl(urls[index].url));
            case "Lyon":
                FormatLyon(callUrl(urls[index].url));
            case "Rennes":
                FormatRennes(callUrl(urls[index].url));
            case "Montpellier":
                FormatMontpellier(callUrl(urls[index].url));
            case "Strasbourg":
                FormatStrasbourg(callUrl(urls[index].url));
        }
    }
};

// FormatLyon(callUrl("https://download.data.grandlyon.com/wfs/rdata?SERVICE=WFS&VERSION=1.1.0&outputformat=GEOJSON&request=GetFeature&typename=jcd_jcdecaux.jcdvelov&SRSNAME=urn:ogc:def:crs:EPSG::4171"));

getDataresponse();
console.table(stations);
