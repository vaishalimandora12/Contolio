const PAYMENTS = require('../models/payments');
const JWT = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const payments = require('../models/payments');

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
    // body('amount').exists().notEmpty().withMessage('amount is required'),
    // body('payment_type').exists().notEmpty().withMessage('payment type is required'),
    // body('remark').exists().notEmpty().withMessage('remark is required'),
    async (req, res) => {
        try {
            //console.log('reeeee', req.body)
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return res.status(400).json({
                    code: 400,
                    message: error.array()[0]['msg']
                })
            }
            const { payment_date, payment_status, status, remark, addExpenses, payment_type, building_id, unit_id, tenant_id, amount, chequeAmount, cheque_date, cheque_no } = req.body;
            // console.log('reeeee', req.body)
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
                if (!amount || amount == null) {
                    return res.status(400).json({
                        code: 400,
                        message: 'amount is required'
                    })
                }
                refData = {
                    payment_type: '1',
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
                if (!addExpenses || addExpenses.length === 0) {
                    return res.status(400).json({
                        code: 400,
                        message: 'addExpenses array is required for payment type 2'
                    });
                }
                for (let val of addExpenses) {
                    if (!val.status || val.status == null) {
                        return res.status(400).json({
                            code: 400,
                            message: 'payment status is required'
                        })
                    }
                    if (!val.cheque_date || val.cheque_date == null) {
                        return res.status(400).json({
                            code: 400,
                            message: 'cheque date is required'
                        })
                    }
                    if (!val.cheque_no || val.cheque_no == null) {
                        return res.status(400).json({
                            code: 400,
                            message: 'cheque no is required'
                        })
                    }
                    if (!val.chequeAmount || val.chequeAmount == null) {
                        return res.status(400).json({
                            code: 400,
                            message: 'amount is required'
                        })
                    }
                }
                refData = {
                    payment_type: '2',
                    building_id: building_id,
                    unit_id: unit_id,
                    tenant_id: tenant_id,
                    addExpenses: addExpenses,
                    remark: remark,
                }
                // console.log(">>..........",refData.addExpenses);
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

exports.getManualPayments = [
    async (req, res) => {
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 5;
        let skip = (page - 1) * limit;
        try {
            const get = await PAYMENTS.aggregate([
                { $skip: skip },
                { $limit: limit },
                {
                    $match: {
                        payment_type: "1",
                    }
                },
                {
                    $lookup: {
                        from: "building_managements",
                        localField: "building_id",
                        foreignField: "_id",
                        as: "buildingDetail"
                    }
                },
                {
                    $lookup: {
                        from: "units",
                        localField: "unit_id",
                        foreignField: "_id",
                        as: "unitDetail"
                    }
                },
                {
                    $lookup: {
                        from: "tenants",
                        localField: "tenant_id",
                        foreignField: "_id",
                        as: "tenantDetail"
                    }
                },
            ]);
            if (get.length > 0) {
                return (res.status(200).json({
                    code: 200,
                    message: " Manual Payments get Successfully",
                    data: get
                }))
            }
            else {
                return (res.status(404).json({
                    code: 404,
                    message: "No Payment Found",
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

exports.getChequePayments = [
    async (req, res) => {
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 5;
        let skip = (page - 1) * limit;
        try {
            const get = await PAYMENTS.aggregate([
                { $skip: skip },
                { $limit: limit },
                {
                    $match: {
                        payment_type: "2",
                    }
                },
                {
                    $lookup: {
                        from: "building_managements",
                        localField: "building_id",
                        foreignField: "_id",
                        as: "buildingDetail"
                    }
                },
                {
                    $lookup: {
                        from: "units",
                        localField: "unit_id",
                        foreignField: "_id",
                        as: "unitDetail"
                    }
                },
                {
                    $lookup: {
                        from: "tenants",
                        localField: "tenant_id",
                        foreignField: "_id",
                        as: "tenantDetail"
                    }
                },

            ]);
            if (get.length > 0) {
                return (res.status(200).json({
                    code: 200,
                    message: " cheque Payments get Successfully",
                    data: get
                }))
            }
            else {
                return (res.status(404).json({
                    code: 404,
                    message: "No Payment Found",
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

exports.getPaymentDetails = [
    async (req, res) => {
        try {
            const find = await PAYMENTS.findOne({ _id: req.query.payment_id })
            if (!find) {
                return (res.status(400).json({
                    code: 400,
                    message: "This payment does not exists..."
                }))
            }
            else {
                return (res.status(200).json({
                    code: 200,
                    message: "payment details fetch successfully...",
                    data: find
                }))
            }
        }
        catch (err) {
            console.log(err);
            return (res.status(500).json({
                code: 500,
                message: "Catch Errorr.."
            }))
        }
    }
]

// exports.searchChequePayments = [
//     async (req, res) => {
//         try {
//             const { cheque_no } = req.query;
//             const findChequePayment = await PAYMENTS.findOne({ addExpenses: { $elemMatch: { cheque_no: cheque_no } } });
//             if (findChequePayment.length == 0) {
//                 return res.status(200).json({
//                     code: 400,
//                     message: "Payment not Found",
//                 });
//             }
//             else {
//                 return res.status(200).json({
//                     code: 200,
//                     message: "Payment Found",
//                     data: findChequePayment,
//                 })
//             }
//         }
//         catch (err) {
//             console.log(err);
//             return res.status(500).json({
//                 code: 500,
//                 message: "catch Error",
//             });
//         }
//     }
// ];

// exports.searchManualPayments = [
//     async (req, res) => {
//         try {
//             const { search } = req.query;
//             if (search) {
//                 const findManualPayments = await PAYMENTS.find(
//                     {
//                         paymentId: { $regex: ".*" + search + ".*", $options: 'i' }
//                     },
//                 );
//                 return res.status(200).json({
//                     code: 200,
//                     message: "Manual Payment Found",
//                     data: findManualPayments,
//                 });
//             }
//         } catch (err) {
//             console.log(err);
//             return res.status(500).json({
//                 code: 500,
//                 message: "catch Error",
//             });
//         }
//     }
// ];

exports.getAllPaymentsOfTenant = [
    async (req, res) => {
        try {
            const get = await PAYMENTS.find({ tenant_id: req.query.tenant_id });
            if (get.length > 0) {
                return (res.status(200).json({
                    code: 200,
                    message: "Payments get Successfully",
                    data: get
                }))
            }
            else {
                return (res.status(400).json({
                    code: 400,
                    message: "No Payment Found",
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


exports.searchChequePayments = [
    async (req, res) => {
        try {
            const { cheque_no } = req.query;
            const findChequePayment = await PAYMENTS.aggregate([
                {
                    $match: {
                        //addExpenses: { $elemMatch: { cheque_no: cheque_no } }
                        "addExpenses.cheque_no": +cheque_no
                    }
                },
                {
                    $lookup: {
                        from: "building_managements",
                        localField: "building_id",
                        foreignField: "_id",
                        as: "buildingDetail"
                    }
                },
                {
                    $lookup: {
                        from: "tenants",
                        localField: "tenant_id",
                        foreignField: "_id",
                        as: "tenantDetail"
                    }
                },
                {
                    $lookup: {
                        from: "units",
                        localField: "unit_id",
                        foreignField: "_id",
                        as: "unitDetail"
                    }
                },
            ])
            console.log(">>>>>>", findChequePayment);

            return res.status(200).json({
                code: 200,
                message: "Payment Found",
                data: findChequePayment,
            })

        }
        catch (err) {
            console.log(err);
            return res.status(500).json({
                code: 500,
                message: "catch Error",
            });
        }
    }
];


exports.searchManualPayments = [
    async (req, res) => {
        try {
            const { search } = req.query;
            const findChequePayment = await PAYMENTS.aggregate([
                {
                    $match: {
                        paymentId: { $regex: ".*" + search + ".*", $options: 'i' }
                    }
                },
                {
                    $lookup: {
                        from: "building_managements",
                        localField: "building_id",
                        foreignField: "_id",
                        as: "buildingDetail"
                    }
                },
                {
                    $lookup: {
                        from: "tenants",
                        localField: "tenant_id",
                        foreignField: "_id",
                        as: "tenantDetail"
                    }
                },
                {
                    $lookup: {
                        from: "units",
                        localField: "unit_id",
                        foreignField: "_id",
                        as: "unitDetail"
                    }
                },
            ])
            return res.status(200).json({
                code: 200,
                message: "Payment Found",
                data: findChequePayment,
            })

        }
        catch (err) {
            console.log(err);
            return res.status(500).json({
                code: 500,
                message: "catch Error",
            });
        }
    }
];

// exports.editPayment = [
//     async (req, res) => {
//         try {
//             const arrayOfEditKeys = ["payment_date", "payment_status", "status", "remark", "addExpenses", "building_id", "unit_id", "tenant_id", "amount", "chequeAmount", "cheque_date", "cheque_no"];
//             const objectUpdate = {};   
//             for (const key of arrayOfEditKeys) {
//                 if (req.body[key] != null) {
//                     objectUpdate[key] = req.body[key];
//                 }
//             }       
//             if (req.body.payment_type === 1 || req.body.payment_type === 2) {
//                 const edit = await PAYMENTS.findOneAndUpdate({ _id: req.body._id }, objectUpdate, { new: true });
                
//                 if (edit) {
//                     return res.status(200).json({
//                         code: 200,
//                         message: "successfully edited.",
//                         data: edit,
//                     });
//                 } else {
//                     return res.status(400).json({
//                         code: 400,
//                         message: "something went wrong!",
//                     });
//                 }
//             } else {
//                 return res.status(400).json({
//                     code: 400,
//                     message: "Invalid Payment Type",
//                 });
//             }
//         } catch (err) {
//             console.log(err);
//             return res.status(500).json({
//                 code: 500,
//                 message: "Catch Error...",
//             });
//         }
//     },
// ];
