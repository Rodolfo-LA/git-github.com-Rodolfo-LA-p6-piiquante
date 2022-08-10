const jwt = require('jsonwebtoken'); // Utilisation du module JETON
require('dotenv').config();      // Appel aux variables d'environnement

// Contrôle pour autorisation de l'utilisateur par comparaison de jeton

module.exports = (req, res, next) => {
   try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.tokenDef);
      const userId = decodedToken.userId;
      req.auth = {
         userId: userId
      };
      next();
   } catch (error) {
      res.status(401).json({ error });
   }
};