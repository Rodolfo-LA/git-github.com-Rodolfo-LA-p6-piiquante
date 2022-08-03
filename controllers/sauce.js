
const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
   const sauceObject = JSON.parse(req.body.sauce);
   delete sauceObject._id;
   delete sauceObject._userId;
   const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: []
   });
   console.log(sauce);
   sauce.save()
      .then(() => res.status(201).json({ message: 'recorded sauce !' }))
      .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
   const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   } : { ...req.body };

   delete sauceObject._userId;
   Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
         if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message: 'Not authorized' });
         } else {
            console.log(sauceObject);
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
               .then(() => res.status(200).json({ message: 'modified sauce' }))
               .catch(error => res.status(401).json({ error }));
         }
      })
      .catch((error) => {
         res.status(400).json({ error });
      });
};

exports.deleteSauce = (req, res, next) => {
   Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
         if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message: 'Not authorized' });
         } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
               Sauce.deleteOne({ _id: req.params.id })
                  .then(() => { res.status(200).json({ message: 'sauce removed' }) })
                  .catch(error => res.status(401).json({ error }));
            });
         }
      })
      .catch(error => {
         res.status(500).json({ error });
      });
};

exports.getOneSauce = (req, res, next) => {
   Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
   Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
}

exports.likeSauce = (req, res, next) => {
   Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
         // traitement like
         switch (req.body.like) {
            case 0:
               // chercher dans quel tab est l'utilisateur
               // supp du tableau l'utlisateur
               // si dans userliked sauce.likes--
               // else sauce.dislikes-- 

               console.log('Utilisateur actuel --> ' + req.auth.userId);

               let pos = sauce.usersLiked.indexOf(req.auth.userId);
               console.log('val like = ' + pos);
               if (pos != -1) {
                  sauce.usersLiked.splice(pos, 1);
                  sauce.likes--;
               } else {
                  pos = sauce.usersDisliked.indexOf(req.auth.userId);
                  sauce.usersDisliked.splice(pos, 1);
                  sauce.dislikes--;
               }
               break;
            case 1:
               sauce.likes++;
               // ajout userId au tab usersLiked
               sauce.usersLiked.push(req.auth.userId);    // à corriger
               break;
            case -1:
               sauce.dislikes++;
               // ajout userId au tab usersDisliked
               sauce.usersDisliked.push(req.auth.userId); // à corriger
               break;
         }
         const sauceObject = JSON.parse(JSON.stringify(sauce));
         delete sauceObject._id;
         delete sauceObject._userId;
         delete sauceObject.__v;
         console.log(sauceObject);
         Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Updated like' }))
            .catch(error => res.status(401).json({ error }));
      })
      .catch(error => res.status(404).json({ error }));
};
