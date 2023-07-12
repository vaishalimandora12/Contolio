const TENANTS = require('../models/tenants');
const JWT = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const CONTRACTS = require('../models/contracts');


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
    body('tenantName').trim().exists().notEmpty().withMessage('Name is required'),
    body('tenantEmail').trim().exists().notEmpty().withMessage('Email is required'),
    body('tenantPhone').exists().notEmpty().withMessage('Phone is required'),
    body('payment').trim().exists().notEmpty().withMessage('payment is required'),

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
            const { building_id, unit_id, contract_id, tenantName, tenantEmail, tenantPhone, payment } = req.body;
            refData = {
                building_id: building_id,
                unit_id: unit_id,
                contract_id: contract_id,
                tenantName: tenantName,
                tenantEmail: tenantEmail,
                tenantPhone: tenantPhone,
                payment: payment,
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


exports.showTenantsRequest = async (req, res) => {
    try {
        const get = await TENANTS.find({ tenant_status: "Request" });
        if (get.length > 0) {
            return (res.status(200).json({
                code: 200,
                message: "Tenants get Successfully",
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

exports.editTenants = [
    body('unit_id').trim().exists().notEmpty().withMessage('Unit id is required'),
    body('building_id').trim().exists().notEmpty().withMessage('building_id is required'),
    body('tenantName').trim().exists().notEmpty().withMessage('Name is required'),
    body('tenantEmail').trim().exists().notEmpty().withMessage('Email is required'),
    body('tenantPhone').exists().notEmpty().withMessage('Phone is required'),
    body('payment').trim().exists().notEmpty().withMessage('payment is required'),
    async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return res.status(400).json({
                    code: 400,
                    message: error.array()[0]['msg']
                })
            }
            else {
                const arrayOfEditKeys = ["tenantName", "tenantEmail", "contract_id", "tenantPhone", "payment", "unit_id", "building_id"];
                const objectUpdate = {};

                for (const key of arrayOfEditKeys) {
                    if (req.body[key] != null) {
                        objectUpdate[key] = req.body[key]
                    }
                }
                const edit = await TENANTS.findByIdAndUpdate({ _id: req.body._id }, objectUpdate, { new: true });
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