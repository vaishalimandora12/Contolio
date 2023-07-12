const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
    building_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'building_management'
    },
    unit_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'units'
    },
    contract_name: {
        type: String,
    },
    start_date: {
        type: Date,
    },
    expiry_date: {
        type: Date,
    },
    upload_image: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    },
    created_on:{
        type:Date,
        default:Date()
    }
},{timestamps:true});

module.exports = mongoose.model('contracts',contractSchema)
