const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');
const User = require('../models/user');
const Product = require('../models/product');

//Middleware que transforma los archivos y se obtienen en req.files
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:type/:id', (req, res) => {
    let type = req.params.type;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha cargado ningún archivo.'
            }
        });
    }

    let validTypes = ['user', 'product'];
    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + validTypes.join(','),
                parameter: type
            }
        });
    }

    // req.files.sample => Sample es el nombre del archivo a seleccionar en el body
    let data = req.files.data;

    //Extensiones permitidas
    let file = data.name.split('.');
    let fileExtension = file[file.length - 1];
    let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];

    if (validExtensions.indexOf(fileExtension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + validExtensions.join(', '),
                ext: fileExtension
            }
        });
    }

    // Cambiar nombre al archivo 
    let nameFile = `${id}-${new Date().getDate()}-${new Date().getMilliseconds()}.${fileExtension}`;

    // Carga el archivo en su respectivo directorio
    data.mv(`uploads/${type}/${nameFile}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (type === 'user') {
            imgUser(id, res, nameFile, type);
        } else {
            imgProduct(id, res, nameFile, type);
        }
    });
});

function imgUser(id, res, nameFile, type) {
    User.findById(id, (err, userDB) => {
        if (err) {
            // Se borra la imagen aunque no se encuentre usuario para que no llenen el servidor de imagenes basura
            deleteFile(nameFile, type)
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!userDB) {
            // Se borra la imagen aunque no se encuentre usuario para que no llenen el servidor de imagenes basura
            deleteFile(nameFile, type)
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }
        deleteFile(userDB.img, type)
        userDB.img = nameFile;
        userDB.save((err, userSaved) => {
            return res.json({
                ok: true,
                user: userSaved,
                img: nameFile,
                message: 'Archivo subido correctamente.'
            });
        });
    });
}

function imgProduct(id, res, nameFile, type) {
    Product.findById(id, (err, productDB) => {
        if (err) {
            // Se borra la imagen aunque no se encuentre usuario para que no llenen el servidor de imagenes basura
            deleteFile(nameFile, type)
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productDB) {
            // Se borra la imagen aunque no se encuentre usuario para que no llenen el servidor de imagenes basura
            deleteFile(nameFile, type)
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }
        deleteFile(productDB.img, type)
        productDB.img = nameFile;
        productDB.save((err, productSaved) => {
            return res.json({
                ok: true,
                product: productSaved,
                img: nameFile,
                message: 'Archivo subido correctamente.'
            });
        });
    });
}

function deleteFile(nameFile, type) {
    // Verificar si ya existe una imagen asociada a ese usuario
    let pathImg = path.resolve(__dirname, `../../uploads/${type}/${nameFile}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}
module.exports = app;