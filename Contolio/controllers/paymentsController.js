const PAYMENTS = require('../models/payments');
const JWT = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}
const randomString = generateRandomString(6);



exports.addPayment = [

    body('building_id').trim().exists().notEmpty().withMessage('building_id is required'),
    body('unit_id').trim().exists().notEmpty().withMessage('unit_id is required'),
    body('tenant_id').trim().exists().notEmpty().withMessage('tenant_id is required'),
    body('amount').exists().notEmpty().withMessage('amount is required'),
    body('payment_type').exists().notEmpty().withMessage('payment type is required'),
    body('remark').exists().notEmpty().withMessage('remark is required'),
    async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return res.status(400).json({
                    code: 400,
                    message: error.array()[0]['msg']
                })
            }
            const { payment_date, payment_status, remark, payment_type, building_id, unit_id, tenant_id, amount, cheque_date, cheque_no, upcoming_payment, } = req.body;
            if (payment_type == 1) {

                if (!payment_date || payment_date == null) {
                    return res.status(400).json({
                        code: 400,
                        message: 'Payment date is required'
                    })
                }
                if (!payment_status || payment_status == null) {
                    return res.status(400).json({
                        code: 400,
                        message: 'Payment status is required'
                    })
                }
                refData = {
                    payment_type:'1',
                    building_id: building_id,
                    unit_id: unit_id,
                    tenant_id: tenant_id,
                    amount: amount,
                    payment_date: payment_date,
                    payment_status: payment_status,
                    remark: remark,
                    paymentId: randomString,
                }
                const addManualPayment = await PAYMENTS.create(refData);
                if (addManualPayment) {
                    return (res.status(200).json({
                        code: 200,
                        message: "payment added successfully...",
                    }))
                }
                else {
                    return (res.status(400).json({
                        code: 400,
                        message: "unable to add payment"
                    }))
                }
            }
            else if (payment_type == 2) {
                if (!upcoming_payment || upcoming_payment == null) {
                    return res.status(400).json({
                        code: 400,
                        message: 'upcoming payment is required'
                    })
                }
                if (!cheque_date || cheque_date == null) {
                    return res.status(400).json({
                        code: 400,
                        message: 'cheque date is required'
                    })
                }
                if (!cheque_no || cheque_no == null) {
                    return res.status(400).json({
                        code: 400,
                        message: 'cheque no is required'
                    })
                }
                refData = {
                    payment_type:'2',
                    building_id: building_id,
                    unit_id: unit_id,
                    tenant_id: tenant_id,
                    amount: amount,
                    upcoming_payment: upcoming_payment,
                    cheque_date: cheque_date,
                    cheque_no: cheque_no,
                    remark: remark,
                }
                const addChequePayment = await PAYMENTS.create(refData);
                if (addChequePayment) {
                    return (res.status(200).json({
                        code: 200,
                        message: " cheque payment added successfully...",
                    }))
                }
                else {
                    return (res.status(400).json({
                        code: 400,
                        message: "unable to add payment"
                    }))
                }
            }
            else {
                return (res.status(400).json({
                    code: 400,
                    message: "Invalid Payment Type"
                }))
            }
        }
        catch (err) {
            console.log(err)
            return (res.status(500).json({
                code: 500,
                message: "Catch Error....."
            }))
        }
    }
]


exports.getManualPayments=[
    async(req,res)=>{
        try {
            const get = await PAYMENTS.find({payment_type:"1"});
            if (get.length > 0) {
                return (res.status(200).json({
                    code: 200,
                    message: "Manual Payments get Successfully",
                    data: get
                }))
            }
            else {
                return (res.status(404).json({
                    code: 404,
                    message: "No payments Found",
                }))
            }
        }
        catch (err) {
            console.log(err)
            return (res.status(500).json({
                code: 500,
                message: "Catch Error!!!",
            }))
        }

    }
]


exports.getChequePayments=[
    async(req,res)=>{
        try {
            const get = await PAYMENTS.find({payment_type:"2"});
            if (get.length > 0) {
                return (res.status(200).json({
                    code: 200,
                    message: "Cheque Payments get Successfully",
                    data: get
                }))
            }
            else {
                return (res.status(404).json({
                    code: 404,
                    message: "No payments Found",
                }))
            }
        }
        catch (err) {
            console.log(err)
            return (res.status(500).json({
                code: 500,
                message: "Catch Error!!!",
            }))
        }

    }
]

