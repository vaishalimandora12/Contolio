const BUILDINGS = require('../models/buildings');
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
// Example usage: generate a random string of length 10
const randomString = generateRandomString(6);


exports.addBuildings = [
    body('buildingName').trim().exists().notEmpty().withMessage('building name  is required'),
    body('address').trim().exists().notEmpty().withMessage('address is required'),
   body('locationLink').trim().exists().notEmpty().withMessage('locationLink is required'),
    body('description').trim().exists().notEmpty().withMessage('description is required'),

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
                const { buildingName, address, locationLink, description } = req.body;
                refData = {
                    buildingName: buildingName,
                    address: address,
                    locationLink: locationLink,
                    description: description,
                    created_build_id: randomString,
                }
                const addBuilding = await BUILDINGS.create(refData)
                if (addBuilding) {
                    return (res.status(200).json({
                        code: 200,
                        message: "Building added successfully...",
                        data:addBuilding
                    }))
                }
                else {
                    return (res.status(400).json({
                        code: 400,
                        message: "unable to add building.."
                    }))
                }
            }
        }
        catch (err) {
            console.log(err)
            return (res.status(500).json({
                code: 500,
                message: "Catch error..."
            }))
        }
    }
]


exports.getBuildingDetails = [
    async (req, res) => {
        try {
            const find = await BUILDINGS.findOne({ _id: req.query.build_id })
            if (!find) {
                return (res.status(400).json({
                    code: 400,
                    message: "This building does not exists..."
                }))
            }
            else {
                return (res.status(200).json({
                    code: 200,
                    message: "Building details fetch successfully...",
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


exports.deleteBuilding = [
    async (req, res) => {
        try {
            const find = await BUILDINGS.findOne({ _id: req.query.build_id })
            if (!find) {
                return (res.status(400).json({
                    code: 400,
                    message: "This building does not exists..."
                }))
            }
            else {
                const delBuilding = await BUILDINGS.deleteOne({ _id: req.query.build_id });
                if (delBuilding) {
                    return (res.status(200).json({
                        code: 200,
                        message: "Building deleted.."
                    }))
                }
                else {
                    return (res.status(400).json({
                        code: 400,
                        message: "Somthing wrong !"
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


exports.editBuilding = [
    body('buildingName').trim().exists().notEmpty().withMessage('building name  is required'),
    body('address').trim().exists().notEmpty().withMessage('address is required'),
    body('location').trim().exists().notEmpty().withMessage('location is required'),
    body('description').trim().exists().notEmpty().withMessage('description is required'),

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
                const arrayOfEditKeys=["buildingName", "address", "location", "units", "description"];
                const objectUpdate= {};
                for (const key of arrayOfEditKeys) {
                    if (req.body[key] != null) {
                        objectUpdate[key] = req.body[key]
                    }
                }
                const edit = await BUILDINGS.findByIdAndUpdate( {_id : req.query.build_id} , objectUpdate, { new: true });
                // console.log(edit);
                if (edit) {
                    return (res.status(200).json({
                        code: 200,
                        message: "successfuly edit..",
                        data:edit
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
                message: "catch errorrrrrr...."
            }))
        }
    }
]


exports.updateStatus = [
    async (req, res) => {
        try {
            const find = await BUILDINGS.findOne({ _id: req.query.build_id });
            if (find) {
                // console.log(find);
                if (find.status == true) {
                    const update = await BUILDINGS.updateOne({_id:find._id},{status:false})
                    if (update) {
                        return (res.status(200).json({
                            code: 200,
                            message: "Status Updated.."
                        }))
                    }
                    else {
                        return (res.status(400).json({
                            code: 400,
                            message: "somthing went wrong!"
                        }))
                    }
                }
                else {
                    const update = await BUILDINGS.updateOne({_id:find._id},{status:true})
                    if (update) {
                        return (res.status(200).json({
                            code: 200,
                            message: "Status Updated.."
                        }))
                    }
                    else {
                        return (res.status(400).json({
                            code: 400,
                            message: "somthing went wrong!!"
                        }))
                    }
                }
            }
            else {
                return (res.status(400).json({
                    code: 400,
                    message: "Building not exits..."
                }))
            }
        }
        catch (err) {
            console.log(err)
            return (res.status(500).json({
                code: 500,
                message: "Catch error......."
            }))
        }
    }
]



exports.getBuildings = async (req, res) => {
    try {
        const get = await BUILDINGS.find();
        // console.log(">>>",get);
        if (get.length > 0) {
            return (res.status(200).json({
                code: 200,
                message: "Buildings get Successfully",
                data: get
            }))
        }
        else {
            return (res.status(404).json({
                code: 404,
                message: "No Building Found",
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

exports.searchBuildings = [
    async (req, res) => {
        try {
            const { search } = req.query
            if (search) {
                const findBuilding = await BUILDINGS.find({ buildingName: { $regex: `^${search ? search : ''}`, $options: 'i' } });
                    return (res.status(200).json({
                        code: 200,
                        message: "Building Found",
                        data:findBuilding ,
                    }))
                }
        }
        catch (err) {
            console.log(err)
            return (res.status(500).json({
                code: 500,
                message: "catch error!!"
            }))
        }
    }
]


