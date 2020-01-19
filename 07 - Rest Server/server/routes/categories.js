const express = require('express');
let middlewares = require('../middlewares/autenticacion');
let app = express();
let Categorie = require('../models/categories');

// -------------------------------
//  Mostrar TODAS las categorias
// -------------------------------
app.get('/categories', middlewares.verificaToken, (req, res) => {
    Categorie.find({})
        .sort('descripcion')
        //Populate permite filtrar los campos a mostrarse del usuario que hace la petición
        .populate('user', 'nombre email')
        .exec((err, categories) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Error en la base de datos'
                    }
                });
            }

            res.json({
                ok: true,
                categories
            });
        });
});
// -------------------------------
//  Mostrar UNA de las categorias
// -------------------------------
app.get('/categories/:id', middlewares.verificaToken, (req, res) => {
    let id = req.params.id

    Categorie.findById(id, (err, categorieGET) => {
        // Error de base de datos
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "Error de base de datos"
                }
            });
        }
        // Error: No se creó la categoría
        if (!categorieGET) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se creó la categoría"
                }
            });
        }
        // Si generó la categoría, le asigna al objeto categorie asociado al Schema.
        res.json({
            ok: true,
            categorie: categorieGET
        });
    });
});

// -------------------------------
//  Crear NUEVA categoria
// -------------------------------
app.post('/categories', middlewares.verificaToken, (req, res) => {
    //Body devuelve los parametros ingresados (Como si fuese un form)
    let body = req.body;
    // Crea un objeto con la estructura del Schema Categorie, cuyos valores obtiene del body y del req de usuario.
    let categorie = new Categorie({
        descripcion: body.descripcion,
        //El req trae de un token con un usuario logueado -> su ID
        user: req.user._id
    });
    categorie.save((err, categorieDB) => {
        // Error de base de datos
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "Error de base de datos"
                }
            });
        }
        // Error: No se creó la categoría
        if (!categorieDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se creó la categoría"
                }
            });
        }
        // Si generó la categoría, le asigna al objeto categorie asociado al Schema.
        res.json({
            ok: true,
            categorie: categorieDB
        });
    });
});

// -------------------------------
//  Actualiza UNA categoria
//      ENVIA EL ID POR PARAMETRO EN LA URL
//      REQUIERE TOKEN
// -------------------------------
app.put('/categories/:id', (req, res) => {
    // ID se obtiene del token con el usuario que modifica la categoria
    let id = req.params.id;
    // Body se obtiene de los parametros ingresados (Como si fuera un form)
    let body = req.body;

    // Actualiza en el formato del objeto (JSON) el valor obtenido del body
    let updateCategorie = {
        descripcion: body.descripcion
    }
    Categorie.findByIdAndUpdate(id, updateCategorie, { new: true, runValidators: true }, (err, categorieUpdated) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "Error de base de datos"
                }
            });
        }
        // Error: No se actualizó la categoría
        if (!categorieUpdated) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se actualizó ninguna categoría"
                }
            });
        }
        // Si actualizó la categoría, le asigna al objeto categorie asociado al Schema.
        res.json({
            ok: true,
            //Tiene que ser igual a como está en la BD
            categorie: categorieUpdated
        });
    });
});

// -------------------------------
//  Elimina UNA las categorias
//      Manda el ID como parametro
//      Elimina fisicamente 
//      REQUIERE TOKEN
//      REQUIERE ADMIN_ROLE
// -------------------------------
app.delete('/categories/:id', [middlewares.verificaToken, middlewares.verificaAdminRole], (req, res) => {
    // ID se obtiene del token con el usuario que elimina la categoria
    let id = req.params.id;

    Categorie.findByIdAndRemove(id, (err, categorieDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "Error de base de datos"
                }
            });
        }
        // Error: No se encontró ninguna categoría
        if (!categorieDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El ID ingresado es incorrecto"
                }
            });
        }
        // Si encontró la categoría de la BD
        res.json({
            ok: true,
            categorieDB
        });
    });
});


module.exports = app;