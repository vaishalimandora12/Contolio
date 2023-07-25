const paymentController=require('../controllers/paymentsController');
const middleware=require('../middleware/middlewareUser');
const express=require('express');
const router=express.Router();

router.post('/addPayment',middleware,paymentController.addPayment);
router.get('/getManualPayments',middleware,paymentController.getManualPayments);
router.get('/getChequePayments',middleware,paymentController.getChequePayments);
router.get('/getPaymentDetails',middleware,paymentController.getPaymentDetails);
router.get('/searchChequePayments',middleware,paymentController.searchChequePayments);
router.get('/searchManualPayments',middleware,paymentController.searchManualPayments);
router.get('/getAllPaymentsOfTenant',middleware,paymentController.getAllPaymentsOfTenant);
// router.put('/editPayment',middleware,paymentController.editPayment);

module.exports=router;