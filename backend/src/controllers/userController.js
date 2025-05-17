const auth = require('../middlewares/auth')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const {authenticateUser,validateUser} = require('../validators/userValidator')
const sendEmail = require('../middlewares/sendEmail')
const hashedPassword = require('../middlewares/hashedPassword')


exports.registerUser = async(req,res) => { 
    const { value,error } = validateUser(req.body)
    if(error){
        res.status(400).send({error:error.details[0].message})
        return
    }
    let user = await User.findOne({email:value.email})
    if(user){
        res.status(400).send({error:'User already exists.'})
        return
    }
    if(value.password != value.confirmPassword){
        res.status(400).send({error:`Passwords don't match.`})
        return
    }
    const password = await hashedPassword(value.password)
    user = new User({
        email: value.email,
        password: password,
    })
    user = await user.save()
    sendEmail(user.email,'VERIFY',user._id)
    res.send('User registered Successfully')
}

exports.loginUser = async(req,res) => {
    const {value,error} = authenticateUser(req.body)
    if(error){
        res.status(400).send({error:error.details[0].message})
        return
    }
    const user = await User.findOne({email:value.email})
    if(!user){
        res.status(400).send({error:'Invalid Email or Password'})
        return
    }
    const validPassword = await bcrypt.compare(value.password,user.password)
    if(!validPassword){
        res.status(400).send({error:'Invalid Email or Password'})
        return
    }
    if(!user.isVerified){
        sendEmail(user.email,'VERIFY',user._id)
        res.status(400).send({error:'Your email is not verified. We have sent a verification email to your email address.'})
        return
    }
    const token = jwt.sign({ _id:user._id,isAdmin:user.isAdmin,isStaff:user.isStaff },process.env.JWT_SECRET_KEY)
    res.send({Authorization:token,email:user.email})
}

exports.verifyEmail = async(req,res)=>{
    
    const token = req.body.token
    if(!token){
        res.status(400).send({error:'No Token provided!'})
        return
    }
    const user = await User.findOne({verifyToken:token,verifyTokenExpiry:{$gt:Date.now()}})
    if(!user){
        res.status(400).send({error:'Invalid Token!'})
        return
    }
    user.isVerified= true
    user.verifyToken = null
    user.verifyTokenExpiry = null
    await user.save()
    res.send('Email Verified Successfully')
}

exports.sendResetEmail = async(req,res)=>{
    const email = req.body.email
    if(!email){
        res.status(400).send({error:'No Email provided!'})
        return
    }
    const user = await User.findOne({email})
    if(!user){
        res.status(400).send({error:'Invalid Email address Entered.'})
        return
    }
    sendEmail(user.email,'RESET',user._id)
    res.send(user)
}

exports.changePassword = async(req,res)=>{
    const { password,confirmPassword,token } = req.body
    
    if(!token){
        res.status(400).send({error:'No Token provided!'})
        return
    }
    
    if(password !== confirmPassword){
        res.status(400).send({error:'Passwords do not match.'})
        return
    }
    
    const user = await User.findOne({forgotPasswordToken:token,forgotPasswordTokenExpiry:{$gt:Date.now()}})
    if(!user){
        
        res.status(400).send({error:'Invalid Token!'})
        return
    }
    const validPassword = await bcrypt.compare(password,user.password)
    if(validPassword){
        res.status(400).send({error:'New Password must be different from the previous one.'})
        return
    }
    const hashedPass = await hashedPassword(password)
    user.password = hashedPass
    user.forgotPasswordToken = null
    user.forgotPasswordTokenExpiry = null
    await user.save()
    
    res.send('Reset Password Successfully')
    return
}

exports.userDetails = auth,async(req,res)=>{
    const user = await User.findById(req.user._id)
    res.send({user})
}
