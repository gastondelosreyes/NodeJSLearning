const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

verify().catch(console.error);
const app = express();

app.post('/login', (req, res) => {
    let body = req.body;
    User.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña INCORRECTOS'
                }
            });
        }
        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña INCORRECTOS'
                }
            });
        }
        let token = jwt.sign({
                user: userDB
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }) //60 segundos * 60 minutos * 24 horas * 30 días
        res.json({
            ok: true,
            user: userDB,
            token: token
        })
    })
});


//Google Sign IN
// Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch(e => {
            // El servidor deniega el acceso
            return res.status(403).json({
                ok: false,
                err: e
            });
        });
    //Busca en el esquema User una coincidencia con el email del usuario de Google
    console.log(googleUser);
    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            // No se pudo generar el vinculo o ninguno registro del esquema coincide
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'No coincide con ningún usuario de la base de datos'
                }
            });
        }
        // Si coincide con un registro del esquema
        if (userDB) {
            // Si el registro tiene el atributo de Google en False pero intenta autenticarse con el Sign In de Google
            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticación de la aplicación'
                    }
                });
            } else {
                // Si es de Google, entonces se le renueva su Token
                let token = jwt.sign({
                        user: userDB
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }) //60 segundos * 60 minutos * 24 horas * 30 días
                res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            }
        } else {
            // Si el usuario no existe
            let user = new User();
            user.nombre = googleUser.nombre;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)';
            user.save((err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                let token = jwt.sign({
                        user: userDB
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }) //60 segundos * 60 minutos * 24 horas * 30 días
                res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            });
        }
    });
});
module.exports = app