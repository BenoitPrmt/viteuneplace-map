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
        case "AixMarseille": // A VERIFIER

            // "nom":"Centre Bourse",
            // "voitureplacescapacite":1579,
            // "voitureplacesdisponibles":1247,
            // "description":null,
            // "typeparking":"Parking",
            // "site":null,
            // "commune":"MARSEILLE",
            // "adresse":"Rue Reine Elisabeth",
            // "codepostal":"13015",
            // "tempsreel":"True",
            // "voitureplacesoccupees":332,
            // "producteur":null,
            // "longitude":5.3746211528778,
            // "latitude":43.296632284718,
            // "pointgeo":{
            // "lon":5.3746211528778,
            //     "lat":43.296632284718

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

    }
    return dataCleaneds;
}