const ownersControllers=require('../controllers/ownersController');
const middleware=require('../middleware/middlewareUser');
const express=require('express');
const router=express.Router()


router.post('/addOwners',middleware,ownersControllers.addOwners);
router.get('/getOwners',middleware,ownersControllers.getOwners);
router.put('/editOwnerDetails',middleware,ownersControllers.editOwnerDetails);
router.delete('/deleteOwner',middleware,ownersControllers.deleteOwner);
router.get('/searchOwner',middleware,ownersControllers.searchOwner);
module.exports = router;