const mongoose = require('mongoose');
const tenantsSchema = new mongoose.Schema({
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
    contract_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'contracts'
    },
    tenantName: {
        type: String,
    },
    tenantEmail: {
        type: String,
    },
    tenantPhone: {
        type: Number,
    },
    contract: {
        type: String,
    },
    tenantID: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true,
    },
    tenant_status: {
        type: String,
        enum: ['Request', 'Linked', 'Unlink'],
        default: "Request",
    },
    search: {
        type: String,
    },
    payment:{
        type:String,
    },
    created_on:{
        type:Date,
        default:Date()
    },
})

module.exports = mongoose.model('tenants', tenantsSchema);
