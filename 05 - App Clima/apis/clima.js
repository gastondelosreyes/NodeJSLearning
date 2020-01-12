const axios = require('axios');

const getDatosClima = async(latitud, longitud) => {
    const instance = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitud}&lon=${longitud}&appid=32f843d833c38373032f825c4a92418a&units=metric`)
    return instance.data.main.temp;
}

module.exports = {
    getDatosClima
}