var map = L.map('map').setView([DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.long], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    minZoom: 10,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var greenIcon = new L.Icon({
    iconUrl: 'img/marker-icon-green.png',
    shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var goldIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-gold.png',
    shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var redIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-red.png',
    shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function buildMarkers() {
    getParking().then((data) => {
        data.results.forEach((parking) => {
            let coords = parking.coords.split(",");

            var marker;
            if (parseInt(parking.dispo) === 0) {
                marker = L.marker([coords[0], coords[1]], {icon: redIcon}).addTo(map);
            } else if (parseInt(parking.dispo) > 0 && parseInt(parking.dispo) < 30) {
                marker = L.marker([coords[0], coords[1]], {icon: goldIcon}).addTo(map);
            } else {
                marker = L.marker([coords[0], coords[1]], {icon: greenIcon}).addTo(map);
            }

            marker.bindPopup(`<b>${parking.name}</b><br>Place(s) disponible(s) : ${parking.dispo}<br>Place(s) totale(s) : ${parking.total}`).openPopup()
        });
    });
}

buildMarkers();