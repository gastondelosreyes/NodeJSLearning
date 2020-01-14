const express = require('express');

const bcrypt = require('bcrypt');

const User = require('../models/user');

const _ = require('underscore'); //El estandar es usar como _

const app = express();

// GET para traer registros
app.get('/usuario', function(req, res) {
    let desde = Number(req.query.desde) || 0;

    let limite = Number(req.query.limite) || 5; // req.query genera un parametro en la URL poniendo ?limite=valor
    let conditions = {
        estado: true
    }
    User.find(conditions, 'nombre email role estado google')
        .skip(desde)
        .limit(limite)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            User.count(conditions, (err, conteo) => {
                res.json({
                    ok: true,
                    users,
                    cuantos: conteo
                });
            });
            res.json({
                ok: true,
                users
            });
        })
})

// POST para crear registros(
app.post('/usuario', function(req, res) {
    let body = req.body;
    let user = new User({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role

    });
    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: userDB
        });
    });

});

// PUT para actualizar registros
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            User: userDB
        })
    });
})

// DELETE
app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let changes = {
        estado: false
    }
    User.findByIdAndUpdate(id, changes, { new: true, runValidators: true }, (err, stateDeleteUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (stateDeleteUser == null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No hay usuario con ese ID'
                }
            });
        }
        res.json({
            ok: true,
            User: stateDeleteUser
        })
    });
})

module.exports = app