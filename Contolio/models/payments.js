const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({


    building_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'building_management'
    },
    tenant_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'tenants'
    },
    unit_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'units'
    },
    amount:{
        type:Number
    },
    cheque_date:{
        type: Date,
    },
    payment_date:{
        type: Date,
    },
    cheque_no:{
        type:Number,
    },
    payment_status:{
        type:String,
    },
    paymentId:{
        type:String,
    },
    upcoming_payment:{
        type:Number,
    },
    remark:{
        type:String,
    },
    payment_type:{
        type:String,
        enum:['1','2']
    },
    created_on:{
        type:Date,
        default:Date(),
    }

})
module.exports = mongoose.model('payments', paymentSchema);
