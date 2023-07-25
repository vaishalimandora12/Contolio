const mongoose=require('mongoose')

const buildingManagementSchema=new mongoose.Schema({

    buildingName:{
        type: String,
    },
    address:{
        type: String,
    },
    locationLink:{
        type: String,
    },
    description:{
        type: String,
    },
    units:{
        type:Number,
        default:0
    },
    status:{
        type:Boolean,
        default:true,
    },
    created_build_id:
    {
        type:String
    },
    owner_id:{
        type: mongoose.Types.ObjectId,
        ref:"owners"
    }
});

module.exports = mongoose.model('building_management',buildingManagementSchema)
