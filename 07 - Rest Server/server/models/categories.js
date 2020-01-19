const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categorieSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'El nombre es necesario']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Categorie', categorieSchema);