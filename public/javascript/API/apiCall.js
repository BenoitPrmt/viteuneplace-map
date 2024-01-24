

async function getParking(url) {
    // TODO : Passer l'URL en paramètre pour la rendre dynamique
    const headers = {
        Accept: "application/json",
    };
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: headers,
        });
        return await response.json();
    } catch (error) {
        return error;
    }
}