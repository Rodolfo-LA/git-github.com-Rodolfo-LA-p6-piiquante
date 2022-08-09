
const mongoose = require('mongoose');  // Utilisation du module mongoose

// Pour un contrôle strict des utilisateurs
const uniqueValidator = require('mongoose-unique-validator');


// Définition du modèle de données pour la base mongoDB des utilisateurs
// Une adresse unique autorisée par utilisateur

const userSchema = mongoose.Schema({
    email : { type :String, required: true, unique : true},
    password : { type : String, required : true}
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User',userSchema);   // Exportation du modèle user
