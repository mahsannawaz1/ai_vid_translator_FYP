const jwt = require('jsonwebtoken')

const auth = (req,res,next)=>{
    let token = req.header('Authorization')
    console.log(token)
    if(!token){
        res.status(401).send({error:'Access denied'})
        return 
    }
    token = token.split(' ')[1]
    try{
        const decodedPayload = jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.user = decodedPayload
        next()
    }
    catch(exception){
        res.status(403).send('Invalid Token')
    }
}

module.exports = auth