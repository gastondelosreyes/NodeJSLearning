require('./config/config')
const express = require('express');
const app = express();
const bodyParser = require('body-parser')

// los .use son middlewares que se disparan cuando pasa el código
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// GET para traer registros
app.get('/usuario', function(req, res) {
    res.json('GET user');
})

// POST para crear registros
app.post('/usuario', function(req, res) {
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es un atributo necesario'
        })
    } else {
        res.json({
            persona: body
        });
    }
})

// PUT para actualizar registros
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        id
    });
})

// DELETE
app.delete('/usuario', function(req, res) {
    res.json('DELETE user');
})

app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto: ', process.env.PORT);
})