const tenantsController=require('../controllers/tenantsController');
const middleware=require('../middleware/middlewareUser');
const express=require('express');
const router=express.Router();



router.post('/addTenants',middleware,tenantsController.addTenants);
router.get('/showTenantsRequest',middleware,tenantsController.showTenantsRequest);
router.put('/editTenants',middleware,tenantsController.editTenants);
router.delete('/deleteTenants',middleware,tenantsController.deleteTenants);




module.exports=router;