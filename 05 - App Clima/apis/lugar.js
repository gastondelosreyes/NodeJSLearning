const axios = require('axios');

const getDatosLugar = async(direccion) => {
    const encodeURL = encodeURI(direccion);
    const instance = axios.create({
        baseURL: 'https://devru-latitude-longitude-find-v1.p.rapidapi.com/latlon.php?',
        headers: { 'x-rapidapi-key': 'a4b2d88c03msh4812c552519f098p1684fdjsn1e90275d20ae' }
    })

    const resp = await instance.get('', {
        params: {
            location: encodeURL
        }
    });

    if (resp.data.Results.length === 0) {
        throw new Error(`No hay resultados para ${direccion}`)
    }

    const data = resp.data.Results[0]
    const dir = data.name;
    const latitud = data.lat;
    const longitud = data.lon;

    return {
        dir,
        latitud,
        longitud
    }
}

module.exports = {
    getDatosLugar
}