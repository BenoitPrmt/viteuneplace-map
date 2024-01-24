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

function setDataInLocalStorage(data, city) {
    let localData = JSON.parse(localStorage.getItem("data"));
    if (localData) {
        let found = false;
        localData.forEach((d) => {
            if (d.city === city) {
                found = true;
                d.data = data;
            }
        });
        if (!found) {
            localData.push({
                city: city,
                data: data,
            });
        }
        localStorage.setItem("data", JSON.stringify(localData));
    } else {
        localStorage.setItem("data", JSON.stringify([{
            city: city,
            data: data,
        }]));
    }
    localStorage.setItem("lastUpdate", Date.now());
}

function checkLastUpdate() {
    let lastUpdate = localStorage.getItem("lastUpdate");
    if (lastUpdate) {
        let now = Date.now();
        let diff = now - lastUpdate;
        return diff > (60000 * 5);
    } else {
        return true;
    }
}

function findCityInLocalStorage(city) {
    let localData = JSON.parse(localStorage.getItem("data"));
    if (localData) {
        localData.forEach((d) => {
            if (d.city === city) {
                return d.data;
            }
        });
    }
    return null;
}

function getData(url, city) {

    let localData = findCityInLocalStorage(city);

    if (localData) {
        if (checkLastUpdate()) {
            getParking(url).then((data) => {
                let dataCleaned = cleanData(data, city);
                setDataInLocalStorage(dataCleaned, city);
                buildMarkers(dataCleaned);
            });
        } else {
            buildMarkers(localData);
        }
    } else {
        getParking(url).then((data) => {
            let dataCleaned = cleanData(data, city);
            setDataInLocalStorage(dataCleaned, city);
            buildMarkers(dataCleaned);
        });
    }
}

function buildMarkers(data) {
    data.forEach((parking) => {

        let markerColor;
        if (!parking.realtime) {
            markerColor = greyIcon;
        } else {
            if (parking.available < 2) {
                markerColor = redIcon;
            } else if (parking.disponibility >= 2 && parking.disponibility < 20) {
                markerColor = goldIcon;
            } else {
                markerColor = greenIcon;
            }
        }

        let marker = L.marker([parking.ylat, parking.xlong], {icon: markerColor}).addTo(map);

        let popupText;
        if (parking.realtime) {
            popupText = `<b>${parking.name}</b><br>Place(s) disponible(s) : ${parking.available}<br>Place(s) totale(s) : ${parking.total}<br>Disponibilité : ${Math.floor(parking.disponibility)}%`;
        } else {
            popupText = `<b>${parking.name}</b><br>Place(s) disponible(s) : Aucune donnée<br>Place(s) totale(s) : ${parking.total}`;
        }

        marker.bindPopup(popupText).openPopup()
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
            getData(citiesData[localCurrentCity], localCurrentCity);
        } else {
            getData(citiesData["Orleans"], "Orleans");
            localStorage.setItem("currentCity", "Orleans");
        }
    });
});

let citiesElement = document.getElementById("cities");
citiesElement = citiesElement.childNodes;

citiesElement.forEach((city) => {
    city.addEventListener("click", () => {
        if (city.innerHTML === localStorage.getItem("currentCity")) return;

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

        getData(citiesData[cityName], cityName);
        city.innerHTML = cityName;
    });
});
