const apiLugar = require('./apis/lugar');
const apiClima = require('./apis/clima');
const argv = require('yargs').options({
    direccion: {
        alias: 'd',
        desc: 'Dirección de la ciudad',
        demand: true
    }
}).argv;

const getInfo = async(direccion) => {
    try {
        const coordenadas = await apiLugar.getDatosLugar(direccion)
        const temp = await apiClima.getDatosClima(coordenadas.latitud, coordenadas.longitud)
        return `El clima de ${coordenadas.dir} es de ${temp}`
    } catch (error) {
        return `No se pudo determinar el clima de ${coordenadas.dir}`
    }
}

getInfo(argv.direccion)
    .then(console.log)
    .catch(console.log)