const TENANTS=require('../models/tenants');
const JWT=require('jsonwebtoken');
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
    
    body('units_id').trim().exists().notEmpty().withMessage('Unit id is required'),
    body('building_id').trim().exists().notEmpty().withMessage('building_id is required'),
    body('tenantName').trim().exists().notEmpty().withMessage('Name is required'),
    body('tenantEmail').trim().exists().notEmpty().withMessage('Email is required'),
    body('tenantPhone').exists().notEmpty().withMessage('Phone is required'),
    body('tenantCountry').trim().exists().notEmpty().withMessage('country is required'),
    // body('contract_id').trim().exists().notEmpty().withMessage('Unit id is required'),

    async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return res.status(400).json({
                    code: 400,
                    message: error.array()[0]['msg']
                })
            }
            const findTenant = await TENANTS.findOne({ units_id:req.body.units_id });
            console.log(findTenant,">>>>>>>>>>>>")
            if (findTenant)
             {
                return(res.status(400).json({
                    code: 400,
                    message: "Tenant Already Exists....",
                }))
            }
            const { building_id,units_id,contract_id, tenantName, tenantEmail, tenantPhone, tenantCountry } = req.body;
            refData = {
                building_id: building_id,
                units_id: units_id,
                contract_id:contract_id,
                tenantName: tenantName,
                tenantEmail: tenantEmail,
                tenantPhone: tenantPhone,
                tenantCountry: tenantCountry,
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




exports.showTenants=async(req,res)=>{
    try{
        const get = await TENANTS.find();
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
    catch(err){
        console.log(err)
        return (res.status(500).json({
            code: 500,
            message: "Catch Error!!!",
        }))        
    }
}




