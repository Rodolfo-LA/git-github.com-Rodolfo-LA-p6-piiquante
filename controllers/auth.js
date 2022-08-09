const jwt = require('jsonwebtoken'); // Utilisation du module JETON

// Contrôle pour autorisation de l'utilisateur par comparaison de jeton

module.exports = (req, res, next) => {
   try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
      const userId = decodedToken.userId;
      req.auth = {
         userId: userId
      };
      next();
   } catch (error) {
      res.status(401).json({ error });
   }
};