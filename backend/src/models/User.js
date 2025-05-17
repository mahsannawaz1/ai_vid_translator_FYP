const mongoose  = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        
        minlength:6
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isStaff:{
        type:Boolean,
        default:false
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verifyToken:{
        type:String,
    },
    verifyTokenExpiry:{
        type:Date,
    },
    forgotPasswordToken:{
        type:String,
    },
    forgotPasswordTokenExpiry:{
        type:Date,
    }
})

module.exports = mongoose.model('User',userSchema)
