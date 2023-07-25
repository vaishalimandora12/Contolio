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
        enum:['Voided','Upcoming Payment','Paid','Overdue Payment']
    },
    paymentId:{
        type:String,
    },
    status: {
        type: String,
        enum: ['Upcoming Payment', 'Pending', 'Settled', 'Overdue', 'Cheque Returned', 'Voided']
      },
    remark:{
        type:String,
    },
    chequeAmount:{
         type: Number 
        },
    payment_type:{
        type:String,
        enum:['1','2']
    },
    addExpenses: [{
        chequeAmount: { type: Number },
        cheque_date: { type: Date },
        status: {
          type: String,
          enum: ['upcoming payment', 'Pending', 'Settled', 'Overdue', 'Cheque Returned', 'Voided']
        },
        cheque_no: { type: Number }
      }],    
    created_on:{
        type:Date,
        default:Date(),
    },
})
module.exports = mongoose.model('payments', paymentSchema);