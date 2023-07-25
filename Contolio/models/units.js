const mongoose=require('mongoose');


const unitsSchema=new mongoose.Schema({
    
    building_id: {
        type: mongoose.Types.ObjectId,
        ref: 'building_management'
    },
    owner_id: {
        type: mongoose.Types.ObjectId,
        ref: 'owners'
    },
    tenant_id: {
        type: mongoose.Types.ObjectId,
        ref: 'tenants'
    },
    contract_id: {
        type: mongoose.Types.ObjectId,
        ref: 'contracts'
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
