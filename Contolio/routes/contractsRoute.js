const contractsController=require('../controllers/contractsController');
const middleware=require('../middleware/middlewareUser');
const express=require('express');
const router=express.Router();
const upload = require('../upload/upload');



router.post('/addContract', middleware, upload.single('upload_image'),contractsController.addContract);
router.get('/getContracts',middleware,contractsController.getContracts);
router.delete('/deleteContract',middleware,contractsController.deleteContract);
router.get('/searchContracts',middleware,contractsController.searchContracts);
module.exports=router;