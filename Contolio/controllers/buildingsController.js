const BUILDINGS = require('../models/buildings');
const JWT = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const UNITS = require("../models/units");
const { default: mongoose } = require('mongoose');

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
                        data: addBuilding
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
        const build_id = req.query.build_id;
        const find = await BUILDINGS.findOne({ _id: build_id });
        const unitsNumber = await UNITS.countDocuments({ building_id: build_id });
  
        const checkFullUnits = await BUILDINGS.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(build_id),
            },
          },
          {
            $lookup: {
              from: "units",
              localField: "_id",
              foreignField: "building_id",
              as: "unitsDetails",
              pipeline: [
                {
                  $match: {
                    fullUnit: "true",
                  },
                },
                {
                  $lookup: {
                    from: "owners",
                    localField: "owner_id",
                    foreignField: "_id",
                    as: "OwnerDetails",
                  },
                },
              ],
            },
          },
        ]);
  
        if (checkFullUnits.length === 0) {
          return res.status(400).json({
            code: 400,
            message: "This building does not exist...",
          });
        } else {
          return res.status(200).json({
            code: 200,
            message: "Building details fetched successfully...",
            data: checkFullUnits, unitsNumber,
          });
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          code: 500,
          message: "Catch Error...",
        });
      }
    },
  ];
  

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
    async (req, res) => {
        try {
            const arrayOfEditKeys = ["buildingName", "address", "locationLink", "description"];
            const objectUpdate = {};
            for (const key of arrayOfEditKeys) {
                if (req.body[key] != null) {
                    objectUpdate[key] = req.body[key]
                }
            }
            const edit = await BUILDINGS.findByIdAndUpdate({ _id: req.body.build_id }, objectUpdate, { new: true });
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


exports.updateStatus = [
    async (req, res) => {
        try {
            const find = await BUILDINGS.findOne({ _id: req.query.build_id });
            if (find) {
                // console.log(find);
                if (find.status == true) {
                    const update = await BUILDINGS.updateOne({ _id: find._id }, { status: false })
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
                    const update = await BUILDINGS.updateOne({ _id: find._id }, { status: true })
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

// exports.getBuildings = async (req, res) => {
//     try {
//         let page = Number(req.query.page);
//         let limit = Number(req.query.limit);
//         let skip = (page - 1) * limit;
//         const get = await BUILDINGS.find().skip(skip).limit(limit);
//         const units = await UNITS.find().count();
//         const unitsNumber = await UNITS.find().count();
//         if (get.length > 0) {
//             return (res.status(200).json({
//                 code: 200,
//                 message: "Buildings get Successfully",
//                 data: get,units
//             }))
//         }

//         else {
//             return (res.status(404).json({
//                 code: 404,
//                 message: "No Building Found",
//             }))
//         }
//     }
//     catch (err) {
//         console.log(err)
//         return (res.status(500).json({
//             code: 500,
//             message: "Catch Error!!!",
//         }))
//     }
// }

exports.searchBuildings = [
    async (req, res) => {
        try {
            const { search } = req.query
            if (search) {
                const findBuilding = await BUILDINGS.find({ buildingName: { $regex: `^${search ? search : ''}`, $options: 'i' } });
                return (res.status(200).json({
                    code: 200,
                    message: "Building Found",
                    data: findBuilding,
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
exports.getBuildings = [
    async (req, res) => {
    try {
        const totalDocuments=await BUILDINGS.countDocuments();
        let page = Number(req.query.page);
        let limit = Number(req.query.limit);
        if(page==0){
            page=1;
        }
        if(limit==0){
            limit=totalDocuments;
        }
        let skip = (page - 1) * limit;
        const buildings = await BUILDINGS.aggregate([
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: "units", 
                    localField: "_id", 
                    foreignField: "building_id", 
                    as: "units" 
                }
            },
            {
                $project: {
                    _id: 1,
                    buildingName: 1,
                    address: 1,
                    locationLink:1,
                    status:1,
                    description:1,
                    units: { $size: "$units" } 
                }
            }
        ]);
        if (buildings.length > 0) {
            const totalPages= Math.ceil(totalDocuments/limit);
            return res.status(200).json({
                code: 200,
                message: "Buildings fetched successfully",
                data: buildings,
                totalPages:totalPages

            });
        } else {
            return res.status(404).json({
                code: 404,
                message: "No Building Found"
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            code: 500,
            message: "Catch Error"
        });
    }
}
]
