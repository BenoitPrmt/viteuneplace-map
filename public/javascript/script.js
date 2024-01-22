let map = L.map('map').setView([DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.long], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    minZoom: 10,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let greenIcon = new L.Icon({
    iconUrl: 'img/marker-icon-green.png',
    shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

let goldIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-gold.png',
    shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

let redIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-red.png',
    shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

let greyIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-grey.png',
    shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function buildMarkers() {
    getParking().then((data) => {
        data.results.forEach((parking) => {


            let markerIcon;
            if (parseInt(parking.nb_places_disponibles) < 2) {
                markerIcon = redIcon;
            } else if (parseInt(parking.taux_disponibilite) >= 2 && parseInt(parking.taux_disponibilite) < 20) {
                markerIcon = goldIcon;
            } else if (parking.places_disponibles_temps_reel !== "oui") {
                markerIcon = greyIcon;
            } else {
                markerIcon = greenIcon;
            }

            let marker = L.marker([parking.ylat, parking.xlong], {icon: markerIcon}).addTo(map);

            let popupText;
            if (parking.places_disponibles_temps_reel === "oui") {
                popupText = `<b>${parking.nom}</b><br>Place(s) disponible(s) : ${parking.nb_places_disponibles}<br>Place(s) totale(s) : ${parking.nb_places}<br>Disponibilité : ${Math.floor(parking.taux_disponibilite)}%`;
            } else {
                popupText = `<b>${parking.nom}</b><br>Place(s) disponible(s) : Aucune donnée<br>Place(s) totale(s) : ${parking.nb_places}`;
            }

            marker.bindPopup(popupText).openPopup()
        });
    });
}

buildMarkers();