const express = require('express');
let middlewares = require('../middlewares/autenticacion');
let app = express();
let Product = require('../models/product');

// -------------------------------
//  Mostrar TODOS los productos
//      Mostrar el usuario y la categoria asociada
//      Ordenado
// -------------------------------
app.get('/product', middlewares.verificaToken, (req, res) => {
    Product.find({ disponible: true })
        .sort('nombre')
        .populate('user')
        .populate('categorie')
        .exec((err, products) => {
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
                products
            });
        });
});

// -------------------------------
//  Muestra un unico producto por ID
//      Mostrar el usuario y la categoria asociada
// -------------------------------

app.get('/product/:id', middlewares.verificaToken, (req, res) => {
    //Obtiene el ID del producto como parametro de la URL
    let id = req.params.id
        //Busca por ID
    Product.findById(id, (err, productsGET) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error en la base de datos'
                }
            });
        }
        if (!productsGET) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe ese producto'
                }
            });
        }
        res.json({
            ok: true,
            productsGET
        });
    });
});

// -------------------------------
//  Mostrar los productos en base a un termino de busqueda
//      Mostrar el usuario y la categoria asociada
// -------------------------------

app.get('/product/search/:term', middlewares.verificaToken, (req, res) => {
    let term = req.params.term;

    let regex = new RegExp(term, 'i');
    Product.find({ nombre: regex })
        .populate('user', 'nombre')
        .populate('categorie', 'descripcion')
        .exec((err, productsGET) => {
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
                productsGET
            })
        });
});


// -------------------------------
//  Crear un nuevo producto
//      Requiere un usuario logueado
//      Requiere de una categoria asociada
// -------------------------------

app.post('/product/:categorie', middlewares.verificaToken, (req, res) => {
    //Obtengo el producto del body simulando ser un formulario
    let body = req.body;
    let categorie = req.params.categorie;
    let product = new Product({
        nombre: body.nombre,
        precioUnidad: body.precioUnidad,
        descripcion: body.descripcion,
        categorie: categorie,
        user: req.user._id
    });

    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error en la base de datos'
                }
            });
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se creó el producto'
                }
            });
        }
        res.json({
            ok: true,
            product: productDB
        });
    });
});

// -------------------------------
//  Actualizar un nuevo producto
//      Requiere un usuario logueado
//      Requiere de una categoria asociada
// -------------------------------

app.put('/product/:id', middlewares.verificaToken, (req, res) => {
    // ID se obtiene de la url del producto
    let id = req.params.id;
    // Body se obtiene de los parametros ingresados (Como si fuera un form)
    let body = req.body;
    // Actualiza en el formato del objeto (JSON) el valor obtenido del body
    let updateProduct = {
        nombre: body.nombre,
        precioUnidad: body.precioUnidad,
        descripcion: body.descripcion,
        categorie: body.categorie,
        user: req.user._id
    }

    Product.findByIdAndUpdate(id, updateProduct, { new: true, runValidators: true }, (err, productUpdated) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "Error de base de datos"
                }
            });
        }
        // Error: No se actualizó el producto
        if (!productUpdated) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "No se actualizó ningún producto"
                }
            });
        }
        // Si actualizó el producto, le asigna al objeto producto asociado al Schema.
        res.json({
            ok: true,
            //Tiene que ser igual a como está en la BD
            product: productUpdated
        });
    });
});

// -------------------------------
//  Eliminar un producto
//      Cambiar la disponibilidad (BORRADO LOGICO)
// -------------------------------

app.delete('/product/:id', middlewares.verificaToken, (req, res) => {
    let id = req.params.id

    Product.findById(id, (err, productDelete) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error en la base de datos'
                }
            });
        }
        if (!productDelete) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe ese producto'
                }
            });
        }
        productDelete.disponible = false;

        productDelete.save((err, productDeleted) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                product: productDeleted
            })
        })
    });
});
module.exports = app