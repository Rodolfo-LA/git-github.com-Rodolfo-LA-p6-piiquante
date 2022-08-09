
const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

// Création des liens entre les middlewares et leurs routes respectives
// pour les utilisateurs

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
