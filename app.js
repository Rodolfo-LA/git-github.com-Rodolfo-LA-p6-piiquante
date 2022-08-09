
const express = require('express');    // Utilisation du module express
const mongoose = require('mongoose');  // Utilisation du module mongoose

// Récupération des routes pour le serveur

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const path = require('path');

// Connection à la base de donnée Mongoose

mongoose.connect('mongodb+srv://coco64:JcjhD6ZUmJ7g2gtS@cluster0.wmn9bgv.mongodb.net/?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connection to MongoDB successful !'))     // Si connection réussite
  .catch(() => console.log('Connection to MongoDB failed !'));       // si connection échoué

const app = express();

// Définition des règles de sécurité pour le CORS

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Utilisation des middlewares liés aux différentes routes

app.use(express.json());
app.use('/api/sauces',sauceRoutes);    // Route pour la gestion des sauces
app.use('/api/auth',userRoutes);       // Route pour la gestion des utilisateurs
app.use('/images', express.static(path.join(__dirname, 'images')));  // Route pour la gestion des images

module.exports = app;      // Rendre les fonctions disponibles pour le serveur