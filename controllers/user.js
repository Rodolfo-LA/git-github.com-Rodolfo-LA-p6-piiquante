
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// gestion des utilisateurs

// Création du compte utilisateur

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)    // promise : hachage du mot de passe
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        console.log({ user });
        user.save()     // promise : enregistrement dans la base.
          .then(() => res.status(201).json({ message: 'Utilisateur enregistré' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

// Connexion au compte utilisateur

  exports.login = (req, res, next) => {
    console.log(req.body.email);
    User.findOne({ email: req.body.email })   // recherche de l'utilisateur dans la base
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            console.log(req.body.password);
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };
