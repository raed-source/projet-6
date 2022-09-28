const Sauce = require('../models/sauceModel');
const fs = require('fs');

// ------------CREER NOUVEAU SOUCE--------------------------
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  console.log('createsauce')
  const sauce = new Sauce({
    ...sauceObject,

    likes: 0,
    dislikes: 0,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce.save().then(
    () => {
      res.status(200).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
//---------------------RECUPERER UNE SAUCE--------------------------
exports.getOneSauce = (req, res, next) => {
  console.log('ce sauces');
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};
// ----------------------MODIFY LE SAUCE------------------------------
exports.modifySauce = (req, res, next) => {

  console.log('modifier sauces');
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  console.log(sauceObject);
  console.log(req.auth.userId);
  if (sauceObject.userId !== req.auth.userId) {
    return res.status(401).json({ error: new Error('Vous ne pouvez pas modifier cette sauce') })
  }
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(
      () => {
        console.log('Sauce modifié !');
        res.status(200).json({
          message: 'Sauce updated successfully!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
};
//   -------------------DELETE SAUCE-------------------------------------
exports.deleteSauce = (req, res, next) => {
  console.log('supprimer sauces');
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId !== req.auth.userId) {
        return res.status(401).json({ error: new Error('Vous ne pouvez pas modifier cette sauce') })
      }
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id }).then(
          () => {
            res.status(200).json({
              message: 'Deleted!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      })
    })

};
// --------------------RECUPERER TOUTES LES SAUCES--------------------
exports.getAllSauces = (req, res, next) => {
  console.log('all sauces');
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );

};

// // ------------------------LIKE SAUCE-----------------------
// exports.likeSauce = (req, res, next) => {
//   Sauce.findOne({ _id: req.params.id })
//     .then((sauce) => {
//       let vot;
//       let votant = req.body.userId;
//       let like = sauce.usersLiked;
//       let unlike = sauce.usersDisliked;
//       let bon = like.includes(votant);
//       let mauvais = unlike.includes(votant);
//       if (bon === true) {
//         vot = 1;
//       } else if (mauvais === true) {
//         vot = -1;
//       } else {
//         vot = 0;
//       }

//       if (vot === 0 && req.body.like === 1) {
//         sauce.likes += 1;
//         sauce.usersLiked.push(votant);
//       } else if (vot === 1 && req.body.like === 0) {
//         sauce.likes -= 1;
//         const nouveauUsersLiked = like.filter((f) => f != votant);
//         sauce.usersLiked = nouveauUsersLiked;
//       } else if (vot === -1 && req.body.like === 0) {
//         sauce.dislikes -= 1;
//         const nouveauUsersDisliked = unlike.filter((f) => f != votant);
//         sauce.usersDisliked = nouveauUsersDisliked;
//       } else if (vot === 0 && req.body.like === -1) {
//         sauce.dislikes += 1;
//         sauce.usersDisliked.push(votant);
//       } else {
//         console.log("tentavive de vote illégal");
//       }
//       Sauce.updateOne(
//         { _id: req.params.id },
//         {
//           likes: sauce.likes,
//           dislikes: sauce.dislikes,
//           usersLiked: sauce.usersLiked,
//           usersDisliked: sauce.usersDisliked,
//         }
//       )
//         .then(() => res.status(200).json({ message: "Vous venez de voter" }))
//         .catch((error) => {
//           if (error) {
//             console.log(error);
//           }
//         });
//     })
//     // si erreur envoit un status 404 Not Found et l'erreur en json
//     .catch((error) => res.status(404).json({ error }));
// }


// -------------------------method 2-----------------------

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (req.body.like === 1) {
        sauce.usersLiked.push(req.body.userId);
      } else if (req.body.like === -1) {
        sauce.usersDisliked.push(req.body.userId);
      } else if (req.body.like === 0) {
        // if (sauce.usersLiked.includes(req.body.userId) === true) {
        //   const userIdIndex = sauce.usersLiked.indexOf(req.body.userId);
        //   sauce.usersLiked.splice(userIdIndex, 1);
        // }
        // if (sauce.usersDisliked.includes(req.body.userId) === true) {
        //   const userIdIndexDisliked = sauce.usersDisliked.indexOf(req.body.userId);
        //   sauce.usersDisliked.splice(userIdIndexDisliked, 1);
        // }
        if (sauce.usersLiked.includes(req.body.userId) === true) {
          const userIdIndex = sauce.usersLiked.indexOf(req.body.userId);
          sauce.usersLiked.splice(userIdIndex, 1);
        } else {
          const userIdIndexDisliked = sauce.usersDisliked.indexOf(req.body.userId);
          sauce.usersDisliked.splice(userIdIndexDisliked, 1);
        }
      }
      sauce.likes = sauce.usersLiked.length;
      sauce.dislikes = sauce.usersDisliked.length;
      Sauce.updateOne(
        { _id: req.params.id },
        {
          likes: sauce.likes,
          dislikes: sauce.dislikes,
          usersLiked: sauce.usersLiked,
          usersDisliked: sauce.usersDisliked,
        }
      )
        .then(() => res.status(200).json({ message: "Vous venez de voter" }))
        .catch((error) => {
          if (error) {
            console.log(error);
          }
        });
    })
    // si erreur envoit un status 404 Not Found et l'erreur en json
    .catch((error) => res.status(404).json({ error }));
}