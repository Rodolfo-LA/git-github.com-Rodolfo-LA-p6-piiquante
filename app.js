
const express = require('express');
const mongoose = require('mongoose');

// récupération des routes pour le serveur

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const path = require('path');

// connection à la base de donnée Mongoose

mongoose.connect('mongodb+srv://coco64:JcjhD6ZUmJ7g2gtS@cluster0.wmn9bgv.mongodb.net/?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// utilisation des middlewares

app.use(express.json());
app.use('/api/sauce',sauceRoutes);
app.use('/api/auth',userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
