let map = L.map('map').setView([DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.long], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    // maxZoom: 20,
    // minZoom: 10,
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

// fetch("cities.json").then((response) => {
//     response.json().then((data) => {
//         console.log(data)
//         for (const d in data) {
//             console.log(d)
//             console.log(data[d])
//             buildMarkers(data[d], d)
//         }
//     });
// })

function buildMarkers(url, city) {
    getParking(url).then((data) => {
        data = cleanData(data, city)
        data.forEach((parking) => {

            let marker;
            if (!parking.realtime) {
                marker = L.marker([parking.ylat, parking.xlong], {icon: greyIcon}).addTo(map);
            } else {
                if (parking.available < 2) {
                    marker = L.marker([parking.ylat, parking.xlong], {icon: redIcon}).addTo(map);
                } else if (parking.disponibility >= 2 && parking.disponibility < 20) {
                    marker = L.marker([parking.ylat, parking.xlong], {icon: goldIcon}).addTo(map);
                } else {
                    marker = L.marker([parking.ylat, parking.xlong], {icon: greenIcon}).addTo(map);
                }
            }


            let popupText;
            if (parking.realtime) {
                popupText = `<b>${parking.name}</b><br>Place(s) disponible(s) : ${parking.available}<br>Place(s) totale(s) : ${parking.total}<br>Disponibilité : ${Math.floor(parking.disponibility)}%`;
            } else {
                popupText = `<b>${parking.name}</b><br>Place(s) disponible(s) : Aucune donnée<br>Place(s) totale(s) : ${parking.total}`;
            }

            marker.bindPopup(popupText).openPopup()
        });
    });
}

// buildMarkers();

let citiesData;
fetch("cities.json").then((response) => {
    response.json().then((data) => {
        citiesData = data;
    }).then(() => {
        let localCurrentCity = localStorage.getItem("currentCity");
        if (localCurrentCity) {
            buildMarkers(citiesData[localCurrentCity], localCurrentCity);
        } else {
            buildMarkers(citiesData["Orleans"], "Orleans");
            localStorage.setItem("currentCity", "Orleans");
        }
    });
});

let citiesElement = document.getElementById("cities");
citiesElement = citiesElement.childNodes;

citiesElement.forEach((city) => {
    city.addEventListener("click", () => {
        if(city.innerHTML === localStorage.getItem("currentCity")) return;

        city.innerHTML = "Chargement...";

        map.remove();
        map = L.map('map').setView([DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.long], 12);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            // maxZoom: 20,
            // minZoom: 10,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        let cityName = city.getAttribute("id");
        localStorage.setItem("currentCity", cityName);

        buildMarkers(citiesData[cityName], cityName);
        city.innerHTML = cityName;
    });
});
