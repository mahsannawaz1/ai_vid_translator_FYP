// require('dotenv').config()
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const sendEmail = async(email,emailType,userId)=>{

    try{
        console.log(userId)
        const hashedToken = await bcrypt.hash(userId.toString(),10)
        let name = ""
        let loggedUser = null
        if(emailType =='VERIFY'){
            const user = await User.findByIdAndUpdate(userId,
                {
                verifyToken:hashedToken,
                verifyTokenExpiry:Date.now() + 3600000
                },
            )
            loggedUser = await User.findById(userId)
            name = `${loggedUser.firstName || ""} ${loggedUser.lastName || ""}`
        } else if(emailType=='RESET'){
            
            const user = await User.findOneAndUpdate({email},
                {
                forgotPasswordToken:hashedToken,
                forgotPasswordTokenExpiry:Date.now() + 3600000
                },
            )
            loggedUser = await User.findById(userId)
            name = `${loggedUser?.firstName || ""} ${loggedUser?.lastName || ""}`
        }
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        })

        const msg = emailType == 'RESET' ? 
        `
        <div class='imageDiv'>
            <img src='../../frontend/vite-project/public/icon.png'/>
        </div>
        <div class='line'></div>
        <h3>HELLO ${name || "Sir"}, </h3>
        <div class='line'></div>
        <p>We received a request to reset your password for your PixelAI account.</p>
        <p>You have registered with the following e-mail address: <span> ${loggedUser?.email} </span> </p>
        <p>Simply click on the button to set a new password:</p>
        <a class="btn" href='${process.env.REACT_APP_URL}/signin/reset?token=${hashedToken}'>Reset Your Password </a> 
        <p >If you didn't ask to change your password, please ignore this email.</p>
        <p>Best Wishes,</p>
        <p>PixelAI Team.</p>
        <p>To contact us, click <a href=${process.env.REACT_APP_URL}><span>contact us.</span></a></p>
        <a href=${process.env.REACT_APP_URL}>www.pixelAI.com.pk</a>
        ` 
        : emailType=='VERIFY' ? 
        `
        <div class='imageDiv'>
            <img src='../../frontend/vite-project/public/icon.png'/>
        </div>
                
        <div class='line'></div>
        <h3>HELLO ${name || "Sir"},</h3>
        <div class='line'></div>
        <p>Thank you for registering with PixelAI and welcome.</p>
        <p>You have registered with the following e-mail address: <span> ${loggedUser?.email} </span> </p>
        <p>Please verify your email address and activate your account by clicking the link below</p>
        <a class="btn" href='${process.env.REACT_APP_URL}/verified?token=${hashedToken}'>Verify your email </a>
        <p>Or verify using this link: <a href='${process.env.REACT_APP_URL}/verified?token=${hashedToken}'>${process.env.REACT_APP_URL}/verified</a></p>
        <p>If you have any questions, check our <a href='${process.env.REACT_APP_URL}'><span>FAQs</span></a>, or contact our Customer Service team.</p>
        <p>Best Wishes,</p>
        <p>PixelAI Team.</p>
        <p>To contact us, click <a href=${process.env.REACT_APP_URL}><span>contact us.</span></a></p>
        <p>Thank you for registering with PixelAI and welcome.</p>
        <a href=${process.env.REACT_APP_URL}>www.pixelAI.com.pk</a>
        ` : ''
        const mailOptions = {
            from:process.env.EMAIL,
            to:email,
            subject: emailType=='VERIFY' ? 
            `Email Verification for ${email} at PixelAI` :
            `Reset Password for ${email} at PixelAI`,
            html:`
        <html>
        <head>
            <style>
                body {
                    font-family: 'Sen', sans-serif;
                    
                }
                .container{
                    padding:5px 20px;
                }
                .imageDiv,{
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    
                }
                .imageDiv img{
                    object-fit:contain;
                }
                .line{
                    height:1px;
                    background:rgb(136, 136, 136,0.2);
                    margin: 10px 0px;
                }
                span{
                    color:rgb(168, 168, 168);
                }
                
                .btn{
                    border:0;
                    outline:0;
                    background:black;
                    color:white;
                    text-transform:uppercase;
                    padding:10px 20px;
                    border-radius:0px;
                    
                }
                a{
                    color:rgb(168, 168, 168);
                    text-decoration:none;
                }
                h3{
                    text-transform:uppercase;
                }

            </style>
        </head>
        <body>
            <div class="container">
                ${msg}
            </div>
        </body>
        </html>
            `
        }
        
        const mailResponse = await transporter.sendMail(mailOptions)
        return mailResponse
        
    }
    catch(error){
        console.log('Error while sending EMAIL')
        console.log(error)
    }
}
module.exports = sendEmail