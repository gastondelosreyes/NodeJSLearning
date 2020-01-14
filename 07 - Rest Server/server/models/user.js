const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}
let userSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: [false, 'Puede subir una foto']
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: false
    },
    google: {
        type: Boolean,
        default: false
    }
});

// Para que cuando devuelve el .json no muestre la password
userSchema.methods.toJSON = function() {
    let oneUser = this;
    let userObject = oneUser.toObject();
    delete userObject.password;

    return userObject;
}
userSchema.plugin(uniqueValidator, {
    message: 'El {PATH} ya está en uso'
})

module.exports = mongoose.model('user', userSchema)