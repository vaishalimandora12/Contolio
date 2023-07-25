const USER = require('../models/users');
const JWT = require('jsonwebtoken');
const salt = 10;
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');


exports.singInLogin = [

    body('email').trim().exists().notEmpty().isLength({ min: 3 }).withMessage('Email is required')
        .isEmail().withMessage('Email must be a valid email address'),
    body('password').trim().exists().notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be 6 in lengths or above'),

    async (req, res) => {
        console.log('in try block')
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return res.status(400).json({
                    code: 400,
                    message: error.array()[0]['msg']
                })
            }
            const { email, password } = req.body;
            console.log('req body', req.body)

            const findUser = await USER.findOne({ email: email })
            if (findUser) {
                const signToken = JWT.sign({ email: email }, 'test');
                return res.status(200).json({
                    code: 200,
                    message: "User logged-in successfully",
                    data: {
                        email: findUser.email,
                        token: signToken
                    }
                });
            }
            else {
                const hashed = await bcrypt.hash(password, salt)
                const refData = {
                    email: email,
                    password: hashed
                }

                const signToken = JWT.sign({ email: email }, 'test');
                const createUser = await USER.create(refData);
                if (createUser) {
                    return (res.status(200).json({
                        code: 200,
                        message: "User registered successfully",
                        data: {
                            email: createUser.email,
                            token: signToken
                        }
                    }));
                }
                else {
                    return (res.status(400).json({
                        code: 400,
                        message: "Something went wrong!"
                    }));
                }
            }
        }
        catch (err) {
            console.log(err, "===============errorrrrrrrrrrr")
            return (res.status(400).json({
                code: 400,
                message: "CATCH ERROR"
            }))
        }
    }
]

exports.register = [
    body('email').trim().exists().notEmpty().isLength({ min: 3 }).withMessage('Email is required')
        .isEmail().withMessage('Email must be a valid email address'),
    body('password').trim().exists().notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be 6 in lengths or above'),
    async (req, res) => {
        try {
            console.log("fineeeee");
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return res.status(400).json({
                    code: 400,
                    message: error.array()[0]['msg']
                })
            }

            const { email, password } = req.body;

            const findUser = await USER.findOne({ email: email })

            if (findUser) {
                return res.status(200).json({
                    code: 200,
                    message: "User is already exist",
                    data: {
                        email: findUser.email,

                    }
                })
            }
            else {

                const signtoken = JWT.sign({ email: email }, 'vaishali');
                const hashed = await bcrypt.hash(password, salt);
                const refData = {
                    email: email,
                    password: hashed
                }
                const createNewUser = await USER.create(refData);
                if (createNewUser) {
                    return (res.status(200).json({
                        code: 200,
                        message: "User_registered_successfully",
                        data: {
                            email: createNewUser.email,
                            token: signtoken
                        }
                    }));
                }
                else {
                    return (res.status(500).json({
                        code: 500,
                        message: "Oops...Something went wrong!!!!!"
                    }));
                }

            }
        }


        catch (err) {
            console.log(err)
            return (res.status(500).json({
                code: 500,
                message: "CATCH ERROR"
            }))
        };
    }];

exports.otpRegister = [
    body('email').trim().exists().notEmpty().isLength({ min: 3 }).withMessage('Email is required')
        .isEmail().withMessage('Email must be a valid email address'),
    body('password').trim().exists().notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be 6 in lengths or above'),
    body('firstname').trim().exists().notEmpty().withMessage('first name is required')
        .isLength({ min: 1, max: 20 }).withMessage('first name must be min 1 and max 20 in lengths'),
    body('lastname').trim().exists().notEmpty().withMessage('last name is required')
        .isLength({ min: 1, max: 20 }).withMessage('last name must be min 1 and max 20 in lengths'),
    body('phone').trim().exists().notEmpty().withMessage('Phone number is required')
        .isLength({ min: 10 }).withMessage('Enter valid phone number'),
    body('role').trim().exists().notEmpty().withMessage('role is required'),
    body('country').trim().exists().notEmpty().withMessage('country is required'),
    body('company').trim().exists().notEmpty().withMessage('company is required'),
    body('officeContact').trim().exists().notEmpty().withMessage('office contact is required'),



    async (req, res) => {
        try {
            const error = validationResult(req)
            if (!error.isEmpty()) {
                return (res.status(400).json({
                    code: 400,
                    message: error.array()[0]['msg']

                }))
            }
            const { firstname, lastname, email, password, phone, role, country, company, officeContact } = req.body;
            console.log('req.body', req.body)
            const findUser = await USER.findOne({ email: email })
            if (findUser) {


                return (res.status(200).json({
                    code: 200,
                    message: "user already exist",
                    // data: {
                    //     firstname: findUser.firstname,
                    //     lastname: findUser.lastname,
                    //     email: findUser.email,
                    //     token: signtoken
                    // }
                }))
            }
            else {
                const signtoken = JWT.sign({ email: email }, 'vaishali');
                const hashed = await bcrypt.hash(password, salt);
                const otp = 1234;
                const refData = {
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: hashed,
                    phone: phone,
                    country: country,
                    role: role,
                    company: company,
                    officeContact: officeContact,
                    otp: otp,

                }

                const createNewUser = await USER.create(refData);
                if (createNewUser) {
                    return (res.status(200).json({
                        code: 200,
                        message: "OTP Sent",
                        token: signtoken


                    }))
                }
                else {
                    return (res.status(400).json({
                        code: 400,
                        message: "Something went wrong..."
                    }))
                }
            }

        }
        catch (err) {
            console.log(err)
            {
                return (res.status(500).json({
                    code: 500,
                    message: "CATCH ERROR..."
                }))
            }


        }
    }

]

exports.otpVerification = [
    body('otp').exists().notEmpty().withMessage("otp is required"),
    body('email').trim().exists().notEmpty().isLength({ min: 3 }).withMessage('Email is required')
        .isEmail().withMessage('Email must be a valid email address'),
    async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return (res.status(400).json({
                    code: 400,
                    message: error.array()[0]['msg']
                }))
            }
            const { email, otp } = req.body;
            console.log('req.body', req.body);
            const userOtp = await USER.findOne({ email: email }, { otp: otp });
            console.log(userOtp);
            if (!userOtp) {
                console.log("hhhhhhhhhhhhh");
                return (res.status(400).json({
                    code: 400,
                    message: 'wrong otp...'
                }))
            }
            else {
                const verified = await USER.updateOne({ email: email }, { isOtpVerified: true })
                if (verified) {
                    const signToken = JWT.sign({ email: email }, 'vaishali');
                    return (res.status(200).json({
                        code: 200,
                        message: "OTP VERIFIED...",
                        data: {
                            email: userOtp.email,
                            token: signToken
                        }
                    }))
                }
                else {
                    return (res.status(400).json({
                        code: 400,
                        message: "somthing wrong...otp is not verified.."
                    }))
                }

            }

        }
        catch (err) {
            console.log(err)
            return (res.status(500).json({
                code: 500,
                message: "CATCH ERROR.."
            }))
        }
    }
]

exports.resendOtp = [
    async (req, res) => {
        try {
            const otp = 4321;
            const { email } = req.body;
            const resend = await USER.findOneAndUpdate({ email: email }, { otp: otp })
            if (!resend) {
                return (res.status(400).json({
                    code: 400,
                    message: "EMAIL NOT EXIST..."
                }))
            }
            else {
                return (res.status(200).json({
                    code: 200,
                    message: "OTP SENT..",
                    data: {
                        firstname: resend.firstname,
                        lastname: resend.lastname,
                        email: resend.email,

                    }
                }))
            }
        }
        catch (err) {
            console.log(err)
            return (res.status(500).json({
                code: 500,
                message: "catch error........"
            }))

        }
    }
]

exports.otpSignUpLogin = [
    body('firstname').trim().exists().notEmpty().withMessage('first name is required')
        .isLength({ min: 1, max: 20 }).withMessage('first name must be min 1 and max 20 in lengths'),
    body('lastname').trim().exists().notEmpty().withMessage('last name is required')
        .isLength({ min: 1, max: 20 }).withMessage('last name must be min 1 and max 20 in lengths'),
    body('email').trim().exists().notEmpty().isLength({ min: 3 }).withMessage('Email is required')
        .isEmail().withMessage('Email must be a valid email address'),
    body('password').trim().exists().notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be 6 in lengths or above'),
    body('phone').trim().exists().notEmpty().withMessage('Phone number is required')
        .isLength({ min: 10 }).withMessage('Enter valid phone number'),
    body('role').trim().exists().notEmpty().withMessage('role is required'),
    body('country').trim().exists().notEmpty().withMessage('country is required'),
    body('company').trim().exists().notEmpty().withMessage('company is required'),
    body('officeContact').trim().exists().notEmpty().withMessage('office contact is required'),

    async (req, res) => {
        try {
            console.log('aaaaaaaaaaaa');
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return (res.status(400).json({
                    code: 400,
                    message: error.array()[0]['msg']

                }))
            }
            const { email, password, firstname, lastname, phone, role, country, company, officeContact } = req.body;
            console.log('req.body', req.body);
            const findUser = await USER.findOne({ email: email })
            console.log(findUser);
            if (findUser) {
                console.log("ffffffffffffff");
                //const loginToken = JWT.sign({ email: email })      

                const otp = 123456;
                const updateUser = await USER.updateOne({ email: email }, { otp: otp })
                if (updateUser) {
                    return (res.status(200).json({
                        code: 200,
                        message: "Otp sent, please verify>>>>>>>>>>.",
                        //token: loginToken
                    }))
                }
                else {
                    const signupToken = JWT.sign({ email: email }, 'vaishali');
                    const otp = 123456;
                    const hashed = await bcrypt.hash(password, salt);
                    refData = {
                        firstname: firstname,
                        lastname: lastname,
                        email: email,
                        role: role,
                        country: country,
                        phone: phone,
                        officeContact: officeContact,
                        company: company,
                        password: hashed,
                        otp: otp,
                        token: signupToken
                    }
                    const createUser = await USER.create(refData);

                    if (createUser) {
                        return (res.status(200).json({
                            code: 200,
                            message: "Otp sent, please verify."
                        }))
                    }
                    else {
                        return (res.status(400).json({
                            code: 400,
                            message: "somthing went wrong..."
                        }))

                    }

                }
            }


        }
        catch (err) {
            console.log(err);
            return (res.status(500).json({
                code: 500,
                message: "catch error........"
            }))


        }
    }
]


exports.changePassword = [
    body('email').trim().exists().notEmpty().isLength({ min: 3 }).withMessage('Email is required')
        .isEmail().withMessage('Email must be a valid email address'),
    body('currentPassword').trim().exists().notEmpty().withMessage('current password is required'),
    body('newPassword').trim().exists().notEmpty().withMessage('new password is required')
        .isLength({ min: 6 }).withMessage('password is too short, must be of length 6'),

    async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return (res.status(400).json({
                    code: 400,
                    message: error.array()[0]['msg']
                }))
            }
            else {
                const { email, currentPassword, newPassword } = req.body;
                console.log('req.body', req.body);
                const findUser = await USER.findOne({ _id: req.currentUser._id });
                console.log(findUser);
                if (!findUser) {
                    return (res.status(400).json({
                        code: 400,
                        message: "somthing went wrong..."
                    }))
                }
                else {
                    const compare = await bcrypt.compare(currentPassword, findUser.password);
                    console.log(compare);
                    if (compare) {
                        //const signtoken = JWT.sign({ email: email }, 'vaishali');

                        const hashed = await bcrypt.hash(newPassword, salt);
                        const passwordUpdate = await USER.updateOne({ email: email }, { password: hashed });
                        if (passwordUpdate) {
                            return (res.status(200).json({
                                code: 200,
                                message: "password updated successfully.."

                            }))

                        }
                        else {
                            return (res.status(400).json({
                                code: 400,
                                message: "Somthing went wrong!"
                            }))

                        }

                    }
                    else {
                        return (res.status(400).json({
                            code: 400,
                            message: "password not matched ..Do forgot your password"
                        }))
                    }
                }
            }
        }
        catch (err) {
            console.log(err);
            return (res.status(500).json({
                code: 500,
                message: "catch error........"
            }))
        }
    }
]

exports.getUserProfile = [

    async (req, res) => {
        console.log(req.currentUser)
        try {
            // const { email } = req.body
            // const findUser = await USER.findOne({ email: email })
            // if (findUser)
            const userData = req.currentUser;

            return (res.status(200).json({
                code: 200,
                message: "profile fetch successfully...",
                data: req.currentUser
            }))


        }
        catch (err) {
            console.log(err);
            return (res.status(500).json({
                code: 500,
                message: "CATCH ERROR 2023.."
            }))

        }
    }
]

exports.addUser = [

    body('email').trim().exists().notEmpty().isLength({ min: 3 }).withMessage('Email is required')
        .isEmail().withMessage('Email must be a valid email address'),
    // body('password').trim().exists().notEmpty().withMessage('Password is required')
    // .isLength({ min: 6 }).withMessage('Password must be 6 in lengths or above'),
    body('firstname').trim().exists().notEmpty().withMessage('first name is required')
        .isLength({ min: 1, max: 20 }).withMessage('first name must be min 1 and max 20 in lengths'),
    body('phone').trim().exists().notEmpty().withMessage('Phone number is required')
        .isLength({ min: 10 }).withMessage('Enter valid phone number'),
    body('role').trim().exists().notEmpty().withMessage('role is required'),
    body('country').trim().exists().notEmpty().withMessage('country is required'),
    body('company').trim().exists().notEmpty().withMessage('company is required'),
    body('officeContact').trim().exists().notEmpty().withMessage('office contact is required'),
    async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return res.status(400).json({
                    code: 400,
                    message: error.array()[0]['msg']
                })
            }
            const { firstname, phone, role, country, company, officeContact } = req.body;
            const email = req.body.email.toLowerCase();
            const find = await USER.findOne({ email: email })
            if (!find) {
                const defaultPassword = "123@abc";
                const hashed = await bcrypt.hash(defaultPassword, salt);

                const refData = {
                    firstname: firstname,
                    email: email,
                    password: hashed,
                    phone: phone,
                    country: country,
                    role: role,
                    company: company,
                    officeContact: officeContact
                }
                const addUser = await USER.create(refData);
                if (addUser) {
                    return (res.status(200).json({
                        code: 200,
                        message: "User Added Successfully"
                    }))
                }
                else {
                    return (res.status(400).json({
                        code: 400,
                        message: "Somthing went wrong!"
                    }))

                }
            }
            else {
                return (res.status(400).json({
                    code: 200,
                    message: "User Already exists"
                }))
            }
        }
        catch (err) {
            console.log(err);
            return (res.status(500).json({
                code: 500,
                message: "Catch Error"
            }))

        }
    }
]

exports.login = [
    body('email').trim().exists().notEmpty().isLength({ min: 3 }).withMessage('Email is required')
        .isEmail().withMessage('Email must be a valid email address'),
    body('password').trim().exists().notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be 6 in lengths or above'),
    async (req, res) => {
        try {
            const error = validationResult(req)
            if (!error.isEmpty()) {
                return (res.status(400).json({
                    code: 400,
                    meaasge: error.array()[0]['msg']
                }))
            }
            const { password } = req.body;
            //console.log('req.body====',req.body);
            const email = req.body.email.toLowerCase();

            const findUser = await USER.findOne({ email: email })
            // console.log('findUser', findUser);
            if (findUser) {
                const com_pass = await bcrypt.compare(password, findUser.password);
                if (!com_pass) {
                    return (res.status(400).json({
                        code: 400,
                        message: "password is not matched",
                    }))
                }
                else {
                    const signToken = JWT.sign({ _id: findUser._id, email: email }, 'vaishali');
                    return res.status(200).json({
                        code: 200,
                        message: "User login successfully",
                        data: {
                            email: findUser.email,
                            token: signToken
                        }
                    });
                }
            }
            else {
                return (res.status(400).json({
                    code: 400,
                    message: "user not exist",
                }))
            }
        }
        catch (err) {
            console.log(err)
            return (res.status(500).json({
                code: 500,
                message: "CATCH ERROR"
            }))

        };
    }
]


exports.editUserProfile = [
    async (req, res) => {
        try {
            const arrayOfEditKeys = ["firstname", "phone", "role", "country", "officeContact", "company"];
            // let objectUpdate = {}

            // for (i = 0; i < arrayOfEditKeys.length; i++) {
            //     if (req.body[arrayOfEditKeys[i]] != null && req.body[arrayOfEditKeys[i]] !=undefined) {
            //         objectUpdate[arrayOfEditKeys[i]] = req.body[req.body[arrayOfEditKeys[i]]]
            //     }
            // }

            const objectUpdate = {};
            for (const key of arrayOfEditKeys) {
                if (req.body[key] != null) {
                    objectUpdate[key] = req.body[key]
                }
            }
            console.log('object', objectUpdate);
            //  const email=req.body.email.toLowerCase();
            const update = await USER.findOneAndUpdate({ _id: req.currentUser._id }, objectUpdate, { new: true });
            console.log(update);
            if (!update) {
                return (res.status(400).json({
                    code: 400,
                    message: "somthing went wrong can not update profile..."
                }))

            }
            else {
                return (res.status(200).json({
                    code: 200,
                    message: "profile updated..",
                    data: update
                }))
            }
        }
        catch (err) {
            console.log(err)
            return (res.status(500).json({
                code: 500,
                message: "CATCH ERROR....."

            }))

        }
    }
]

exports.changeUserPassword = [
    body('currentPassword').trim().exists().notEmpty().withMessage('current password is required'),
    body('newPassword').trim().exists().notEmpty().withMessage('new password is required')
        .isLength({ min: 6 }).withMessage('password is too short, must be of length 6'),
    async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return (res.status(400).json({
                    code: 400,
                    message: error.array()[0]['msg']
                }))
            }
            const { currentPassword, newPassword } = req.body;
            const findUser = await USER.findById({ _id: req.currentUser._id });
            if (findUser) {
                const compare = await bcrypt.compare(currentPassword, findUser.password);
                if (compare) {
                    const hashed = await bcrypt.hash(newPassword, salt);
                    const passwordUpdate = await USER.updateOne({ _id: req.currentUser._id }, { password: hashed });
                    if (passwordUpdate) {
                        return (res.status(200).json({
                            code: 200,
                            message: "Password Changed!"
                        }))
                    }
                    else {
                        return (res.status(400).json({
                            code: 400,
                            message: "Somthing went Wrong!"
                        }))
                    }
                }
                else {
                    return (res.status(400).json({
                        code: 400,
                        message: "Your Current Password Is Wrong!"
                    }))
                }
            }
        }
        catch (err) {
            console.log(err)
            return (res.status(500).json({
                code: 500,
                message: "Catch Error!"
            }))
        }
    }
]

exports.forgotPassword = [
    body('email').trim().exists().notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email must be a valid email address'),
    async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return res.status(400).json({
                    code: 400,
                    message: error.array()[0]['msg']
                })
            }
            const { email } = req.body;
            const check = await USER.findOne({ email: email });
            // console.log("check>>>>>>>", check);
            const mailer = nodemailer.createTransport({
                service: "gmail",
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.MAIL_USERNAME,
                    pass: process.env.MAIL_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false,
                  }
            });
            // console.log("=======",check.email)
            await mailer.sendMail({
                from: "vaishalimandora12@gmail.com",
                to: check.email,
                subject: "FORGOT YOUR PASSWORD",
                html: `
                 <h3>Click the link below to reset you're password</h3>
                 ${req.protocol}://${req.headers.host}`,
            });

            // if (check) {
            //     return (res.status(200).json({
            //         code: 200,
            //         message: "OTP SENT,please check your email"
            //     }))

            // }
            // else {
            //     return (res.status(400).json({
            //         code: 400,
            //         message: "Email does not exist"
            //     }))
            // }
            res.status(201).json({
                message:"code sent successfullyyyy...."
            })
        }
        catch (err) {
            console.log(err)
            return (res.status(500).json({
                code: 500,
                message: "Catch Error"
            }))

        }
    }
]
