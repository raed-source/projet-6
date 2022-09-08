const Sauce= require('../models/sauceModel');

// ------------CREER NOUVEAU SOUCE--------------------------
exports.createSauce=(req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  console.log('createsauce')
    const sauce = new Sauce({
      ...sauceObject,
        // userId: { type: String, required: true },
        // name: { type: String, required: true },
        // _id: req.params.id,
        // manufacturer: req.body.manufacturer,
        // description: req.body.description,
        // heat:req.body.heat,
        likes:0,
        dislikes:0,
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}` ,
        // mainPepper:req.body.mainPepper,
        usersLiked:[],
        usersDisliked:[],
        // userId: req.body.userId
      });
      sauce.save().then(
        () => {
          res.status(201).json({
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
exports.getOneSauce=(req, res, next) => {
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
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
} : { ...req.body };
    Sauce.updateOne({_id: req.params.id}, sauceObject).then(
      () => {
        res.status(201).json({
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
    Sauce.deleteOne({_id: req.params.id}).then(
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
  };
// --------------------RECUPERER TOUTES LES SAUCES--------------------
exports.getAllSauces=(req, res, next) => {
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