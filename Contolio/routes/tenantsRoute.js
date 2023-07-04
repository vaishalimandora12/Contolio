const tenantsController=require('../controllers/tenantsController');
const middleware=require('../middleware/middlewareUser');
const express=require('express');
const router=express.Router();



router.post('/addTenants',middleware,tenantsController.addTenants);
router.get('/showTenants',middleware,tenantsController.showTenants);



module.exports=router;