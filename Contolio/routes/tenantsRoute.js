const tenantsController=require('../controllers/tenantsController');
const middleware=require('../middleware/middlewareUser');
const express=require('express');
const router=express.Router();



router.post('/addTenants',middleware,tenantsController.addTenants);
router.get('/showTenantRequest',middleware,tenantsController.showTenantRequest);
router.get('/showLinkedTenants',middleware,tenantsController.showLinkedTenants);
router.put('/editTenants',middleware,tenantsController.editTenants);
router.delete('/deleteTenants',middleware,tenantsController.deleteTenants);
router.put('/verifyAndLinkTenant',middleware,tenantsController.verifyAndLinkTenant);
router.put('/linkedTenantWithPayments',middleware,tenantsController.linkedTenantWithPayments);
router.get('/getTenantDetails',middleware,tenantsController.getTenantDetails);
router.get('/searchLinkedTenant',middleware,tenantsController.searchLinkedTenant);
router.get('/searchRequestTenant',middleware,tenantsController.searchRequestTenant);
module.exports=router;