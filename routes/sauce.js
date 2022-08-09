const express = require('express');    // Utilisation du module express
const router = express.Router();       // Appel aux méthodes de la gestion des routes

// Appel aux différents middleware pour les routes sauce

const auth = require('../controllers/auth');
const multer = require('../controllers/multer-config');
const sauceCtrl = require('../controllers/sauce');

// Création des liens entre les middlewares et leurs routes respectives

router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer,sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;   // Pour recupération de la gestion des routes pour les sauces
