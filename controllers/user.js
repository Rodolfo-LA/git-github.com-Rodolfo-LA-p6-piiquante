
const bcrypt = require('bcrypt');      // Utilsation du module pour cryptage
const User = require('../models/User');
const jwt = require('jsonwebtoken');   // Utilisation du module pour l'usage de JETON
require('dotenv').config();            // Appel aux variables d'environnement
const passwordValidator = require('password-validator'); // Utilisation du module validation mot de passe 

// gestion des utilisateurs

// Création du compte utilisateur dans la base mongoDB

exports.signup = (req, res, next) => {

   const ctrlPass = new passwordValidator();          // nouvelles contraintes pour le mot de passe 
   ctrlPass
      .is().min(8)                                    // Longueur minimal 8
      .is().max(100)                                  // Longueur maximale 100
      .has().uppercase()                              // Doit avoir des lettres majuscules
      .has().lowercase()                              // Doit contenir des lettres minuscules
      .has().digits(2)                                // Doit avoir au moins 2 chiffres
      .has().not().spaces()                           // Ne doit pas avoir d'espaces
      .is().not().oneOf(['Passw0rd', 'Password123']); // Mettre ces valeurs sur liste noire

   if (ctrlPass.validate(req.body.password)) {
      // le mot de passe est assez robuste
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
   }
   else {
      // le mot de passe n'est pas assez robuste
      res.status(400).json({ message: 'Password not strong enough' });
   }
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
