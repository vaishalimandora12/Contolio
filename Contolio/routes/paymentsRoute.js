const paymentController=require('../controllers/paymentsController');
const middleware=require('../middleware/middlewareUser');
const express=require('express');
const router=express.Router();

router.post('/addPayment',middleware,paymentController.addPayment);
router.get('/getManualPayments',middleware,paymentController.getManualPayments);
router.get('/getChequePayments',middleware,paymentController.getChequePayments);
module.exports=router;
