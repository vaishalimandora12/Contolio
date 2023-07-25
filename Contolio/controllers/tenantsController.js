const TENANTS = require('../models/tenants');
const JWT = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const CONTRACTS = require('../models/contracts');
const { mongo, default: mongoose } = require('mongoose');


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


exports.addTenants = [

    body('unit_id').trim().exists().notEmpty().withMessage('Unit id is required'),
    body('building_id').trim().exists().notEmpty().withMessage('building_id is required'),
    body('tenantName').trim().exists().notEmpty().withMessage(' Tenant Name is required'),
    body('tenantEmail').trim().exists().notEmpty().withMessage('Email is required'),
    body('tenantPhone').exists().notEmpty().withMessage('Phone is required'),
    body('payment').trim().exists().notEmpty().withMessage('payment is required'),
    body('country').trim().exists().notEmpty().withMessage('country is required'),

    async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return res.status(400).json({
                    code: 400,
                    message: error.array()[0]['msg']
                })
            }
            const findTenant = await TENANTS.findOne({ unit_id: req.body.unit_id });
            if (findTenant) {
                return (res.status(400).json({
                    code: 400,
                    message: "Tenant Already Exists....",
                }))
            }
            const { building_id, unit_id, country, contract_id, tenantName, tenantEmail, tenantPhone, payment } = req.body;
            refData = {
                building_id: building_id,
                unit_id: unit_id,
                contract_id: contract_id,
                tenantName: tenantName,
                tenantEmail: tenantEmail,
                tenantPhone: tenantPhone,
                payment: payment,
                country: country,
                tenantID: randomString,
            }
            const addTenants = await TENANTS.create(refData)
            if (addTenants) {
                return (res.status(200).json({
                    code: 200,
                    message: "Tenant added successfully...",
                }))
            }
            else {
                return (res.status(400).json({
                    code: 400,
                    message: "unable to add Tenant"
                }))
            }
        }
        catch (err) {
            console.log(err)
            return (res.status(500).json({
                code: 500,
                message: "Catch error....."
            }))
        }
    }
]

exports.showTenantRequest =[
    async (req, res) => {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 5;
    let skip = (page - 1) * limit;
    try {
        const get = await TENANTS.aggregate([
            { $skip: skip },
            { $limit: limit },
            {
                $match: {
                    tenant_status: "Request",
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
        ]);
        if (get.length > 0) {
            return (res.status(200).json({
                code: 200,
                message: "Tenants Request get Successfully",
                data: get
            }))
        }
        else {
            return (res.status(404).json({
                code: 404,
                message: "No Tenant Found",
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

exports.editTenants = [
    async (req, res) => {
        try {
            const arrayOfEditKeys = ["tenantName", "country", "tenantEmail", "contract_id", "tenantPhone", "payment", "unit_id", "building_id"];
            const objectUpdate = {};

            for (const key of arrayOfEditKeys) {
                if (req.body[key] != null) {
                    objectUpdate[key] = req.body[key]
                }
            }
            const edit = await TENANTS.findByIdAndUpdate({ _id: req.body._id}, objectUpdate, { new: true });
            if (edit) {
                return (res.status(200).json({
                    code: 200,
                    message: "successfuly edit..",
                    data: edit
                }))
            }
            else {
                return (res.status(400).json({
                    code: 400,
                    message: "somthing went wrong!"
                }))
            }
        }
        catch (err) {
            console.log(err)
            return (res.status(500).json({
                code: 500,
                message: "catch error...."
            }))
        }
    }
]

exports.deleteTenants = [
    async (req, res) => {
        try {
            const find = await TENANTS.findOne({ _id: req.query._id });
            if (!find) {
                return (res.status(400).json({
                    code: 400,
                    message: "This Tenant does not exists..."
                }))
            }
            else {
                const delTnt = await TENANTS.deleteOne({ _id: req.query._id });
                if (delTnt) {
                    return (res.status(200).json({
                        code: 200,
                        message: "Tenant deleted.."
                    }))
                }
                else {
                    return (res.status(400).json({
                        code: 400,
                        message: "somthing wrong !"
                    }))
                }
            }
        }
        catch (err) {
            console.log(err);
            return (res.status(500).json({
                code: 500,
                message: "CATCH ERROR..."
            }))
        }
    }
]

exports.verifyAndLinkTenant = [
    async (req, res) => {
        try {
            const { tenant_id, requestType } = req.body;
            const find = await TENANTS.findOne({ _id: tenant_id });

            if (!find) {
                return res.status(404).json({
                    code: 404,
                    message: "Tenant not found."
                });
            }

            const checkVerify = await TENANTS.findOne({ _id: find._id, tenant_view_button: 'Verify' });
            if (checkVerify) {
                if (requestType === 'Reject') {
                    const updateTenant = await TENANTS.findOneAndUpdate({ _id: find._id }, { tenant_view_button: 'Reject' }, { new: true });
                    return res.status(200).json({
                        code: 200,
                        message: "Tenant rejected successfully.",
                        data: updateTenant
                    });
                } else {
                    return res.status(400).json({
                        code: 400,
                        message: "Tenant already verified."
                    });
                }
            } else {
                if (requestType === 'Verify') {
                    const updateTenant = await TENANTS.findOneAndUpdate({ _id: find._id }, { tenant_view_button: 'Verify' }, { new: true });
                    return res.status(200).json({
                        code: 200,
                        message: "Tenant verified.",
                        data: updateTenant
                    });
                } else if (requestType === 'Reject') {
                    const updateTenant = await TENANTS.findOneAndUpdate({ _id: find._id }, { tenant_view_button: 'Reject' }, { new: true });
                    return res.status(200).json({
                        code: 200,
                        message: "Tenant rejected.",
                        data: updateTenant
                    });
                } else {
                    return res.status(400).json({
                        code: 400,
                        message: "Invalid Request Type."
                    });
                }
            }
        } catch (err) {
            console.log(err, "===========");
            return res.status(500).json({
                code: 500,
                message: "Catch Error...",
            });
        }
    }
];

exports.linkedTenantWithPayments = [
    async (req, res) => {
        try {
            const { tenant_id, payment_id } = req.body
            const updateTenant = await TENANTS.findByIdAndUpdate({ _id: tenant_id, tenant_status: "Request" }, { tenant_view_button: "Verify", tenant_status: "Linked", payment_id: payment_id }, { new: true })
            if (updateTenant) {
                return (res.status(200).json({
                    code: 200,
                    message: "Tenant linked",
                    data: updateTenant
                }))
            }
            return (res.status(400).json({
                code: 400,
                message: "Unable to link tenant",
            }))
        }
        catch (err) {
            console.log(err)
            return (res.status(500).json({
                code: 500,
                message: "Catch Error.."
            }))
        }
    }
]

exports.showLinkedTenants = [
    async (req, res) => {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 5;
    let skip = (page - 1) * limit;
    try {
        const get = await TENANTS.aggregate([
            { $skip: skip },
            { $limit: limit },
            {
                $match: {
                    tenant_status: "Linked",
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
        ]);
        if (get.length > 0) {
            return (res.status(200).json({
                code: 200,
                message: " Linked Tenants get Successfully",
                data: get
            }))
        }
        else {
            return (res.status(404).json({
                code: 404,
                message: "No Tenant Found",
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

exports.getTenantDetails = [
    async (req, res) => {
    try {
        const get = await TENANTS.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(req.query.tenant_id),
                    tenant_status: "Linked",
                }
            },
            {
                $unwind: "$contract_id",
                // preseveNullAndEmptyArray: true,
            },
            {
                $unwind: "$payment_id",
                // preseveNullAndEmptyArray: true,
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
            // {
            //     $lookup: {
            //         from: "contracts",
            //         localField: "contract_id",
            //         foreignField: "_id",
            //         as: "contractDetail"
            //     }
            // },
            // {
            //     $lookup: {
            //         from: "payments",
            //         localField: "payment_id",
            //         foreignField: "_id",
            //         as: "paymentDetail"
            //     }
            // },           
        ]);
        return (res.status(200).json({
            code: 200,
            message: " Linked Tenant get Successfully",
            data: get
        }))
    }
    catch (err) {
        console.log(err, '==============-=================------')
        return (res.status(500).json({
            code: 500,
            message: "Catch Error!!!",
        }))
    }
}
]

exports.searchLinkedTenant = [
    async (req, res) => {
        try {
            const { search } = req.query;
            const findSearch= await TENANTS.aggregate([
                {
                    $match: {
                        tenantName: { $regex: ".*" + search + ".*", $options: 'i' },
                        tenant_status:"Linked",            
                    }
                },
                {
                    $lookup:{
                        from: "building_managements",
                        localField: "building_id",
                        foreignField: "_id",
                        as: "buildingDetail"
                    }
                },
                {
                    $lookup:{
                        from: "units",
                        localField: "unit_id",
                        foreignField: "_id",
                        as: "unitDetail"
                    }
                },
            ])
           
                return res.status(200).json({
                    code: 200,
                    message: "Tenant Found",
                    data: findSearch,
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


exports.searchRequestTenant = [
    async (req, res) => {
        try {
            const { search } = req.query;
            const findSearch= await TENANTS.aggregate([
                {
                    $match: {
                        tenantName: { $regex: ".*" + search + ".*", $options: 'i' },
                        tenant_status:"Request",            
                    }
                },
                {
                    $lookup:{
                        from: "building_managements",
                        localField: "building_id",
                        foreignField: "_id",
                        as: "buildingDetail"
                    }
                },
                {
                    $lookup:{
                        from: "units",
                        localField: "unit_id",
                        foreignField: "_id",
                        as: "unitDetail"
                    }
                },
            ])
           
                return res.status(200).json({
                    code: 200,
                    message: "Tenant Found",
                    data: findSearch,
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

