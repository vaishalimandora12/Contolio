const mongoose=require('mongoose');


const unitsSchema=new mongoose.Schema({
    
    building_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'building_management'
    },
    unitNo:{
        type: Number,
    },
    area:{
        type: String,
    },
    rooms:{
        type: Number,
    },
 
    bathrooms:{
        type:Number,
    },
    // tenantName:{
    //     type:String,

    // },
    monthly_rent:{
        type:String,

    },
    currency:{
        type:String,


    },
    description:{
        type:String,
    },
    upload_image:{
        type:String
    },
    status:{
        type:Boolean,
        default:true
    },
    created_unit_id:{
        type:String
    }
});
module.exports = mongoose.model('units',unitsSchema);
