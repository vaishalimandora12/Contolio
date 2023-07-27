const CONTRACTS = require('../models/contracts');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

exports.addContract = [
    body('building_id').trim().exists().notEmpty().withMessage('building_id is required'),
    body('unit_id').trim().exists().notEmpty().withMessage('unit_id is required'),
    body('contract_name').trim().exists().notEmpty().withMessage('contract name is required'),
    body('start_date').exists().notEmpty().withMessage('start date is required'),
    body('expiry_date').exists().notEmpty().withMessage('expiry date is required'),
    async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return (res.status(400).json({
                    code: 400,
                    message: error.array()[0]['msg']
                }))
            }
            const { contract_name, building_id, unit_id, start_date, expiry_date, upload_image } = req.body;
            // const upload_image = req.file.filename;
            refData = {
                unit_id: unit_id,
                building_id: building_id,
                contract_name: contract_name,
                start_date: start_date,
                expiry_date: expiry_date,
                upload_image: upload_image,
            }
            const addContracts = await CONTRACTS.create(refData)
            if (addContracts) {
                return (res.status(200).json({
                    code: 200,
                    data: addContracts,
                    message: "Contract added successfully...",
                }))
            }
            else {
                return (res.status(400).json({
                    code: 400,
                    message: "unable to add Contract...."
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

exports.getContracts = [
    async (req, res) => {
        try {
            let page = Number(req.query.page) || 1;
            let limit = Number(req.query.limit) || 5;
            let skip = (page - 1) * limit;

            const totalDocuments = await CONTRACTS.countDocuments();
            const get = await CONTRACTS.aggregate([
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
                const totalPages = Math.ceil(totalDocuments / limit);
                return (res.status(200).json({
                    code: 200,
                    message: "Contracts get Successfully",
                    data: get,
                    totalPages: totalPages
                }))
            }
            else {
                return (res.status(404).json({
                    code: 404,
                    message: "No Contract Found",
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
exports.deleteContract = [
    async (req, res) => {
        try {
            const find = await CONTRACTS.findOne({ _id: req.query._id });
            if (!find) {
                return (res.status(400).json({
                    code: 400,
                    message: "This contract does not exists..."
                }))
            }
            else {
                const delOwner = await CONTRACTS.deleteOne({ _id: req.query._id });
                if (delOwner) {
                    return (res.status(200).json({
                        code: 200,
                        message: "Contract deleted.."
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

exports.searchContracts = [
    async (req, res) => {
        try {
            const { search } = req.query;
            if (search) {
                const findContract = await CONTRACTS.aggregate([
                    {
                        $match: {
                            contract_name: { $regex: ".*" + search + ".*", $options: 'i' }
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
                ])
                return res.status(200).json({
                    code: 200,
                    message: "Contract Found",
                    data: findContract,
                });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                code: 500,
                message: "catch Error",
            });
        }
    }
];