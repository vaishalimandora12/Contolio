const jwt = require('jsonwebtoken');
const USER = require('../models/users');

const validateToken=async(req,res,next)=>{
    try{
        let token = req.headers.authorization;

        if (!token){
            return(res.status(400).json({
                code:400,
                message:"Token is required,or it is in correct token.. "
            }))
        }
        
        let decode = jwt.verify(token, 'vaishali');
        if(!decode) {
            return(res.status(400).json({
                code:400,
                message:"Token is not verified"
            }))
        }
        // console.log('deocode',decode);
        // console.log(decode)
        let userData = await USER.findOne({ _id: decode._id, email: decode.email });
        // console.log(userData);
        if(!userData){
            return(res.status(400).json({
                code:400,
                message:"No user found with this token..",   
            }))
        }
        else{
            req.currentUser = userData;
            // console.log('req',req.currentUser)
        }       
         next();
    }
    catch(err){
        console.log(err)
        return(res.status(500).json({
                code:500,
                message:"catch error"
            }))
    }
}

module.exports = validateToken;