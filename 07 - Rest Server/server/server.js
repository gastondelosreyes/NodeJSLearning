require('./config/config')
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// los .use son middlewares que se disparan cuando pasa el código
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Configuración global de rutas
app.use(require('./routes/index'));

// parse application/json
app.use(bodyParser.json());

// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

const conn = mongoose.connect(process.env.URLDB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto: ', process.env.PORT);
})