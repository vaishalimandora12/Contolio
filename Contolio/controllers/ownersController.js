const OWNERS = require('../models/owners');
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


exports.addOwners = [

    body('ownerName').trim().exists().notEmpty().withMessage('ownerName is required'),
    body('ownerEmail').trim().exists().notEmpty().withMessage('ownerEmail is required'),
    body('ownerPhone').exists().notEmpty().withMessage('ownerPhone is required'),
    async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return res.status(400).json({
                    code: 400,
                    message: error.array()[0]['msg']
                })
            }
            const { ownerEmail } = req.body;
            const ownerExist = await OWNERS.findOne({ ownerEmail: ownerEmail });
            if (ownerExist) {
                return (res.status(400).json({
                    code: 400,
                    message: "Owner Already Exists....",
                }))
            }
            else {

                const { ownerName, ownerEmail, ownerPhone, remarks } = req.body;
                refData = {
                    ownerName: ownerName,
                    ownerId: randomString,
                    ownerEmail: ownerEmail,
                    ownerPhone: ownerPhone,
                    remarks: remarks
                }

                const addOwners = await OWNERS.create(refData)

                if (addOwners) {
                    return (res.status(200).json({
                        code: 200,
                        message: "Owner added successfully...",
                    }))
                }
                else {
                    return (res.status(400).json({
                        code: 400,
                        message: "unable to add Owner"
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

exports.getOwners = [
    async (req, res) => {
        try {
            let page = Number(req.query.page) || 1;
            let limit = Number(req.query.limit) || 5;
            let skip = (page - 1) * limit;

            const totalDocuments = await OWNERS.countDocuments();
            const get = await OWNERS.find().skip(skip).limit(limit);
            if (get.length > 0) {
                const totalPages = Math.ceil(totalDocuments / limit);
                return (res.status(200).json({
                    code: 200,
                    message: "Owners get Successfully",
                    data: get,
                    totalPages: totalPages
                }))
            }
            else {
                return (res.status(404).json({
                    code: 404,
                    message: "No Owners Found",
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

exports.editOwnerDetails = [
    async (req, res) => {
        try {
            const arrayOfEditKeys = ["ownerName", "ownerEmail", "ownerPhone", "remarks"];
            const objectUpdate = {};

            for (const key of arrayOfEditKeys) {
                if (req.body[key] != null) {
                    objectUpdate[key] = req.body[key]
                }
            }
            const edit = await OWNERS.findByIdAndUpdate({ _id: req.body._id }, objectUpdate, { new: true });
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
                message: "catch errorrrrrr...."
            }))
        }
    }
]

exports.deleteOwner = [
    async (req, res) => {
        try {
            const find = await OWNERS.findOne({ _id: req.query._id });
            if (!find) {
                return (res.status(400).json({
                    code: 400,
                    message: "This Owner does not exists..."
                }))
            }
            else {
                const delOwner = await OWNERS.deleteOne({ _id: req.query._id });
                if (delOwner) {
                    return (res.status(200).json({
                        code: 200,
                        message: "Owner deleted.."
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


exports.searchOwner = [
    async (req, res) => {
        try {
            const { search } = req.query;
            if (search) {
                const findOwner = await OWNERS.find(
                    {
                        ownerName: { $regex: ".*" + search + ".*", $options: 'i' }
                    },
                );
                return res.status(200).json({
                    code: 200,
                    message: "Owner Found",
                    data: findOwner,
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
]