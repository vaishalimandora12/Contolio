const express=require('express');
const router=express.Router();
const userController=require('../controllers/usersController');
const middleware=require('../middleware/middlewareUser');
// console.log('here')

router.post('/singInLogin', userController.singInLogin);
router.post('/register',userController.register);
router.post('/otpRegister',userController.otpRegister);
router.post('/otpSignUpLogin',userController.otpSignUpLogin);
router.post('/otpVerification',userController.otpVerification);
router.post('/resendOtp',userController.resendOtp);
// router.patch('/changePassword', middleware ,userController.changePassword);
// router.get('/getProfile', userController.getProfile);
// router.patch('/editProfile',middleware,userController.editProfile);


router.post('/addUser', userController.addUser);
router.post('/login',userController.login);
router.get('/getUserProfile',middleware,userController.getUserProfile);
router.patch('/editUserProfile',middleware,userController.editUserProfile);
router.patch('/changeUserPassword',middleware,userController.changeUserPassword);
router.post('/forgotPassword',middleware,userController.forgotPassword);


module.exports = router;



