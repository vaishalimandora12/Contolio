const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    firstname:{
        type: String,
    },
    
    email:{
        type: String,
    },
 
    password:{
        type:String,
        default:''
    },
    otp:{
        type: Number,
    },
    phone:{
        type:Number,
    },
    role:{
        type:String,
    },
    country:{
        type:String,
    },
    officeContact:{
        type:Number,

    },
    company:{
        type:String,

    }


});

module.exports = mongoose.model('users',userSchema)
