
const bcrypt = require('bcrypt');      // Utilsation du module pour cryptage
const User = require('../models/User');
const jwt = require('jsonwebtoken');   // Utilisation du module pour l'usage de JETON
require('dotenv').config();            // Appel aux variables d'environnement

// gestion des utilisateurs

// Création du compte utilisateur dans la base mongoDB

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)    // promise : hachage du mot de passe
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()     // promise : enregistrement dans la base.
          .then(() => res.status(201).json({ message: 'Utilisateur enregistré' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

// Connexion au compte utilisateur dans la base mongoDB

  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })   // recherche de l'utilisateur dans la base
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Incorrect login/password pair'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Incorrect login/password pair' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.tokenDef,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };
