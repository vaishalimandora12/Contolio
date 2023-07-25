const UNITS = require('../models/units');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const { pipeline } = require('nodemailer/lib/xoauth2');

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

exports.addUnits = [
    body('unitNo').trim().exists().notEmpty().withMessage('Unit No is required'),
    body('building_id').trim().exists().notEmpty().withMessage('building_id is required'),
    body('rooms').trim().exists().notEmpty().withMessage('rooms is required'),
    body('bathrooms').trim().exists().notEmpty().withMessage('bathrooms is required'),
    body('area').trim().exists().notEmpty().withMessage('area is required'),
    body('monthly_rent').trim().exists().notEmpty().withMessage('monthly_rent is required'),
    // body('user_id').trim().exists().notEmpty().withMessage('user_id is required'), 
    body('currency').trim().exists().notEmpty().withMessage('currency is required'),
    // body('tenantName').trim().exists().notEmpty().withMessage('tenantName is required'),
    body('description').trim().exists().notEmpty().withMessage('descriptiom is required'),

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
                const { building_id, unitNo, rooms, bathrooms, area, currency, description, monthly_rent } = req.body;
                refData = {
                    // user_id:user_id,
                    building_id: building_id,
                    unitNo: unitNo,
                    // tenantName:tenantName,
                    rooms: rooms,
                    bathrooms: bathrooms,
                    area: area,
                    monthly_rent: monthly_rent,
                    currency: currency,
                    description: description

                }

                const addUnits = await UNITS.create(refData)
                if (addUnits) {
                    return (res.status(200).json({
                        code: 200,
                        message: "Unit added successfully...",
                    }))
                }
                else {
                    return (res.status(400).json({
                        code: 400,
                        message: "unable to add Unit"
                    }))
                }
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

exports.viewAvUnitDetails = [
    async (req, res) => {
        try {
            // const find = await UNITS.findOne({ _id: req.query.unit_id })
            // console.log(find,">>>>>>")
            // if (!find) {
            //     return (res.status(400).json({
            //         code: 400,
            //         message: "This unit does not exists..."
            //     }))
            // }
            // else {
            const view = await UNITS.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(req.query.unit_id),
                    }
                },
                {
                    $lookup: {
                        from: "building_managements",
                        localField: "building_id",
                        foreignField: "_id",
                        as: "BuildingDetail"
                    }
                },


                // {
                //     $unwind:"$unitAndBuildingDetail",                        
                // },

                // { 
                //     $project:{
                //         "buildingName":1,
                //         "address":1,
                //         "locationLink":1,
                //         "description":1
                //     }

                // },


            ]);
            return (res.status(200).json({
                code: 200,
                data: view,
                message: "Unit details fetch successfully...",
            }))
            // }
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

exports.deleteUnit = [
    async (req, res) => {
        try {
            const find = await UNITS.findOne({ _id: req.query.unit_id })
            if (!find) {
                return (res.status(400).json({
                    code: 400,
                    message: "This Unit does not exists..."
                }))
            }
            else {
                const delUnit = await UNITS.deleteOne({ _id: req.query.unit_id });
                if (delUnit) {
                    return (res.status(200).json({
                        code: 200,
                        message: "Unit deleted.."
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

exports.addAvUnits = [
    body('building_id').trim().exists().notEmpty().withMessage('building_id is required'),
    body('unitNo').trim().exists().notEmpty().withMessage('Unit No is required'),
    body('rooms').trim().exists().notEmpty().withMessage('rooms is required'),
    body('bathrooms').trim().exists().notEmpty().withMessage('bathrooms is required'),
    body('area').trim().exists().notEmpty().withMessage('area is required'),
    body('monthly_rent').trim().exists().notEmpty().withMessage('monthly_rent is required'),
    body('currency').trim().exists().notEmpty().withMessage('currency is required'),
    body('description').trim().exists().notEmpty().withMessage('descriptiom is required'),
    async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return res.status(400).json({
                    code: 400,
                    message: error.array()[0]['msg']
                })
            }
            const { building_id, owner_id, tenant_id, unitNo, rooms, bathrooms, area, currency, description, monthly_rent, upload_image } = req.body;
            // const upload_image = req.file.filename;
            refData = {
                building_id: building_id,
                tenant_id: tenant_id,
                owner_id: owner_id,
                unitNo: unitNo,
                rooms: rooms,
                bathrooms: bathrooms,
                area: area,
                monthly_rent: monthly_rent,
                currency: currency,
                upload_image: upload_image,
                description: description,
                created_unit_id: randomString,
            }
            const addAvUnits = await UNITS.create(refData)
            if (addAvUnits) {
                return (res.status(200).json({
                    code: 200,
                    data: addAvUnits,
                    message: "Unit added successfully...",
                }))
            }
            else {
                return (res.status(400).json({
                    code: 400,
                    message: "unable to add Unit"
                }))
            }
        }
        catch (err) {
            console.log(err, "+================>>>>>>")
            return (res.status(500).json({
                code: 500,
                message: "Catch error....."
            }))
        }
    }
]

exports.showAvUnits = [
    async (req, res) => {
        try {
            let page = Number(req.query.page) || 1;
            let limit = Number(req.query.limit) || 5;
            let skip = (page - 1) * limit;
            const get = await UNITS.aggregate([
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "building_managements",
                        localField: "building_id",
                        foreignField: "_id",
                        as: "buildingDetail"
                    }
                },
            ]);
            if (get.length > 0) {
                return (res.status(200).json({
                    code: 200,
                    message: " Available Units get Successfully",
                    data: get
                }))
            }
            else {
                return (res.status(404).json({
                    code: 404,
                    message: "No Avaailable Units Found",
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

exports.editAvUnit = [
    async (req, res) => {
        try {
            const arrayOfEditKeys = ["building_id", "unitNo", "rooms", "bathrooms", "area", "currency", "description", "monthly_rent", "upload_image"];
            const objectUpdate = {};
            for (const key of arrayOfEditKeys) {
                if (req.body[key] != null) {
                    objectUpdate[key] = req.body[key];
                }
            }
            const edit = await UNITS.findByIdAndUpdate({ _id: req.body._id }, objectUpdate, { new: true });
            if (edit) {
                return res.status(200).json({
                    code: 200,
                    data: edit,
                    message: "successfully edited.",
                });
            } else {
                return res.status(400).json({
                    code: 400,
                    message: "something went wrong!"
                });
            }
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({
                code: 500,
                message: "catch error..."
            });
        }
    }
];

exports.showUnits = [
    async (req, res) => {
        try {
            let page = Number(req.query.page) || 1;
            let limit = Number(req.query.limit) || 5;
            let skip = (page - 1) * limit;
            const get = await UNITS.aggregate([
                { $skip: skip },
                { $limit: limit },
                {
                    $match: {
                        fullUnit: "true",
                    }
                },
                {
                    $unwind: "$tenant_id",
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
                        from: "tenants",
                        localField: "tenant_id",
                        foreignField: "_id",
                        as: "tenantDetail"
                    }
                },
                // {
                //   $unwind:"$tenantDetail.contract_id"
                // },
                {
                    $lookup: {
                        from: "tenantDetail",
                        localField: "contract_id",
                        foreignField: "_id",
                        as: "contractDetail",
                    }
                },
                {
                    $lookup: {
                        from: "owners",
                        localField: "owner_id",
                        foreignField: "_id",
                        as: "ownerDetail"
                    }
                },

            ]);
            if (get.length > 0) {
                return (res.status(200).json({
                    code: 200,
                    message: "Units get Successfully",
                    data: get
                }))
            }
            else {
                return (res.status(404).json({
                    code: 404,
                    message: "No Units Found",
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

exports.editShowUnits = [
    async (req, res) => {
        try {
            const arrayOfEditKeys = ["building_id", "tenant_id", "owner_id", "unitNo", "rooms", "bathrooms", "area", "currency", "description", "monthly_rent"];
            const objectUpdate = {};
            for (const key of arrayOfEditKeys) {
                if (req.body[key] != null) {
                    objectUpdate[key] = req.body[key];
                }
            }
            const edit = await UNITS.findByIdAndUpdate({ _id: req.body._id }, objectUpdate, { new: true });
            if (edit) {
                return res.status(200).json({
                    code: 200,
                    data: edit,
                    message: "successfully edited.",
                });
            } else {
                return res.status(400).json({
                    code: 400,
                    message: "something went wrong!"
                });
            }
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({
                code: 500,
                message: "catch error..."
            });
        }
    }
];

exports.deleteShowUnit = [
    async (req, res) => {
        try {
            const find = await UNITS.findOne({ _id: req.query._id })
            if (!find) {
                return (res.status(400).json({
                    code: 400,
                    message: "This Unit does not exists..."
                }))
            }
            else {
                const delUnit = await UNITS.deleteOne({ _id: req.query._id });
                if (delUnit) {
                    return (res.status(200).json({
                        code: 200,
                        message: "Unit deleted.."
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

exports.searchAvUnits = [
    async (req, res) => {
        try {
            const unitNo = Number(req.query.unitNo)
            const findUnitNo = await UNITS.aggregate([
                {
                    $match: {
                        unitNo
                    },
                },
                {
                    $lookup: {
                        from: "building_managements",
                        localField: "building_id",
                        foreignField: "_id",
                        as: "buildingDetail",
                    },
                },
            ]);

            // if (findUnitNo.length == 0) {
            //     return res.status(200).json({
            //         code: 400,
            //         message: "Not Found",
            //     });
            // }

            return res.status(200).json({
                code: 200,
                message: "Found",
                data: findUnitNo,
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                code: 500,
                message: "Catch Error",
            });
        }
    }
];

