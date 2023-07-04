const mongoose=require('mongoose');
const tenantsSchema=new mongoose.Schema({
    building_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'building_management'
    },
    units_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'units'
    },
    contract_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'contracts'
    },
   
    tenantName:{
        type: String,
    },
    tenantEmail:{
        type: String,
    },
    tenantPhone:{
        type:Number,
    },
    country:{
        type:String,
    },
    contract:{
        type:String,
    },
    tenantID:{
        type: String,
    },
    status:{
        type:Boolean,
        default:true,
    },
    search:{
        type:String,
    }
})

module.exports = mongoose.model('tenants',tenantsSchema);