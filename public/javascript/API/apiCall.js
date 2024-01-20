

async function getParking() {
    // TODO : Passer l'URL en paramètre pour la rendre dynamique
    const headers = {
        Accept: "application/json",
    };
    try {
        const response = await fetch("https://data.orleans-metropole.fr/api/explore/v2.1/catalog/datasets/om-mobilite-parcs-stationnement/records?limit=100", {
            method: "GET",
            headers: headers,
        });
        return await response.json();
    } catch (error) {
        return error;
    }
}