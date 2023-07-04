const mongoose = require('mongoose');
const ownersSchema = new mongoose.Schema({


    // building_id: {
    //     type: mongoose.Types.ObjectId,
    //     required: true,
    //     ref: 'building_management'
    // },
    //     user_id: {
    //         type: mongoose.Types.ObjectId,
    //         required: true,
    //         ref: 'users'
    //     },
    //    tenant_id: {
    //     type: mongoose.Types.ObjectId,
    //        required: true,
    //        ref: 'tenants'
    //    },
    //    units_id: {
    //         type: mongoose.Types.ObjectId,
    //         required: true,
    //         ref: 'units'
    //     },

    ownerName: {
        type: String,
    },
    ownerId: {
        type: String,
    },
    ownerEmail: {
        type: String,
    },
    ownerPhone: {
        type: Number,
    },
    status: {
        type: Boolean,
        default: true,
    },
    remarks: {
        type: String,
    }

})

module.exports = mongoose.model('owners', ownersSchema);
