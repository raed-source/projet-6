// ---------------partie require-------------------------------
const express=require('express');
const router= express.Router();
const auth=require('../middleware/auth');
const sauceController=require('../controllers/sauceController');


router.get('/', sauceController.getAllSauces);
router.post('/', sauceController.createSauce);
router.get('/:id', sauceController.getOneSauce);
router.put('/:id', sauceController.modifySauce);
router.delete('/:id', sauceController.deleteSauce);


module.exports=router;