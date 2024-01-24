function cleanData(data, city) {
    /*
    * Nettoyage des datas de chaque parking
    * Chaque ville a des données différentes, il faut donc adapter ces données pour les rendre utilisables sur la carte
    *
    * Arguments:
    * - data: les données du parking (array d'objets)
    * - city: la ville du parking (string)
    *
    * Retour:
    * - dataCleaneds: les données du parking nettoyées (array d'objets)
    * */

    let dataCleaneds = [];

    switch (city) {
        case "Aix-Marseille":
            data.results.forEach((parking) => {
                dataCleaneds.push({
                    name: parking.nom,
                    xlong: parking.longitude,
                    ylat: parking.latitude,
                    realtime: parking.tempsreel === "True",
                    available: parking.voitureplacesdisponibles,
                    total: parking.voitureplacescapacite,
                    disponibility: Math.floor(parking.voitureplacesdisponibles / parking.voitureplacescapacite * 100),
                });
            });
            break;
        case "Orleans":
            data.results.forEach((parking) => {
                dataCleaneds.push({
                    name: parking.nom,
                    xlong: parking.xlong,
                    ylat: parking.ylat,
                    realtime: parking.places_disponibles_temps_reel === "oui",
                    available: parking.nb_places_disponibles,
                    total: parking.nb_places,
                    disponibility: parking.taux_disponibilite,
                });
            });
            break;
    }
    return dataCleaneds;
}