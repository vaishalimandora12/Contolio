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
        type: [],
        ref: 'contracts'
    },
    payment_id:{
        type: Array,
        ref:'payments',
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
    country: {
        type: String,
    },
    payment:{
        type:String,
        enum:['Manual','Cheque']
    },
    created_on:{
        type:Date,
        default:Date()
    },
    tenant_view_button:{
        type:String,
        enum:['Cancel','Reject','Verify'],
        default: 'Cancel'
    },
})

module.exports = mongoose.model('tenants', tenantsSchema);
