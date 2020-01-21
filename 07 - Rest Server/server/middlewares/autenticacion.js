const jwt = require('jsonwebtoken')
    // ======================
    // Verificar Token
    // ======================

let verificaToken = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }
        req.user = decoded.user;
        next();
    })
};
// ======================
// Verificar Token por imagen
// ======================

let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }
        req.user = decoded.user;
        next();
    })
};


// ======================
// Verificar Admin Role
// ======================

let verificaAdminRole = (req, res, next) => {
    let user = req.user;
    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        res.json({
            ok: false,
            err: {
                message: 'El usuario no es un administrador'
            }
        });
    }
};
module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}