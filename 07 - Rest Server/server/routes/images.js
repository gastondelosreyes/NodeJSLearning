const express = require('express');
const fs = require('fs');
const path = require('path');
const middlewares = require('../middlewares/autenticacion')
let app = express();

app.get('/images/:type/:img', middlewares.verificaTokenImg, (req, res) => {
    let type = req.params.type;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../../uploads/${type}/${img}`);
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg)
    } else {
        let defaultImg = path.resolve(__dirname, '../assets/default.jpg');
        //Lee el contenido del archivo y lo regresa, sin importar el tipo
        res.sendFile(defaultImg)
    }
});

module.exports = app;