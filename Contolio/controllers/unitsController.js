const UNITS = require('../models/units');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');


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
                    // unitNo: unitNo,
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
                const view=await UNITS.aggregate([
                    {
                        $match: {
                            _id:new mongoose.Types.ObjectId( req.query.unit_id),
                        }
                    },
                    {
                        $lookup:{
                            from:"building_managements",
                            localField:"building_id",
                            foreignField:"_id",
                            as:"unitAndBuildingDetail"
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
                    data:view,
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
    }]
    
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

exports.addAvUnits = [
    body('building_id').trim().exists().notEmpty().withMessage('building_id is required'),
    body('unitNo').trim().exists().notEmpty().withMessage('Unit No is required'),
    body('rooms').trim().exists().notEmpty().withMessage('rooms is required'),
    body('bathrooms').trim().exists().notEmpty().withMessage('bathrooms is required'),
    body('area').trim().exists().notEmpty().withMessage('area is required'),
    body('monthly_rent').trim().exists().notEmpty().withMessage('monthly_rent is required'),
    body('currency').trim().exists().notEmpty().withMessage('currency is required'),
    body('description').trim().exists().notEmpty().withMessage('descriptiom is required'),
    // body('upload_image').trim().exists().notEmpty().withMessage('Upload image is required'),
    async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return res.status(400).json({
                    code: 400,
                    message: error.array()[0]['msg']
                })
            }
            const { building_id, unitNo, rooms, bathrooms, area, currency, description, monthly_rent } = req.body;
            const upload_image = req.file.filename;
            refData = {
                building_id: building_id,
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
            const find = await UNITS.find({ status: true })
            if (!find) {
                return (res.status(400).json({
                    code: 400,
                    message: "Unit are not available"
                }))
            }
            else {
                return (res.status(200).json({
                    code: 200,
                    message: " Available Units fetch successfully...",

                    // building_Id: find.building_id,
                    // user_id: find.user_id,
                    // unitNo: find.unitNo,
                    // area: find.area,
                    // rooms:find.rooms,
                    // bathrooms:find.bathrooms,
                    // tenantName: find.tenantName,
                    // monthly_rent:find.monthly_rent,
                    // currency:find.currency,
                    // description: find.description
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
    }]

exports.editUnit = [
    body('unitNo').trim().exists().notEmpty().withMessage('Unit No is required'),
    body('building_id').trim().exists().notEmpty().withMessage('building_id is required'),
    body('rooms').trim().exists().notEmpty().withMessage('rooms is required'),
    body('bathrooms').trim().exists().notEmpty().withMessage('bathrooms is required'),
    body('area').trim().exists().notEmpty().withMessage('area is required'),
    body('monthly_rent').trim().exists().notEmpty().withMessage('monthly_rent is required'),
    body('currency').trim().exists().notEmpty().withMessage('currency is required'),
    // body('tenantName').trim().exists().notEmpty().withMessage('tenantName is required'),
    body('description').trim().exists().notEmpty().withMessage('description is required'),

    async (req, res) => {
        // console.log(req)
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return res.status(400).json({
                    code: 400,
                    message: error.array()[0]['msg']
                });
            } else {
                const arrayOfEditKeys = ["building_id", "unitNo", "rooms", "bathrooms", "area", "currency", "description", "monthly_rent"];
                const objectUpdate = {};
                for (const key of arrayOfEditKeys) {
                    if (req.body[key] != null) {
                        objectUpdate[key] = req.body[key];
                    }
                }
                console.log(">>>>>>",req.body);
                //is this unit existed in this building

                const checkBuildingId= await UNITS.findOne({building_id:req.body.building_id});
                
                if(!checkBuildingId){
                    return(res.status(400).json({
                        code:400,
                        message:"this unit is not exist in this building"
                    }))
                }                
                const edit = await UNITS.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(req.body._id) }, objectUpdate, { new: true });
                // console.log("edit=======", edit)
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
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                code: 500,
                message: "catch error..."
            });
        }
    }
];


