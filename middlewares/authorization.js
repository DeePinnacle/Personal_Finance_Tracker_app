// user login, token authorization 

const jwt = require('jsonwebtoken')
require('dotenv').config()

const { 
    userModelSchema ,
    adminModelSchema
} =  require('../model/schema')

const tokenVerification = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization')
        const splitToken = authHeader.split(" ")
        const token = splitToken[1]

        if(token === null){
           return res.status(400).json({ message: 'sorry token cannot be null' })
        }

        const verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN)

        if(!verifyToken){
            return res.status(401).json({ message: 'Access not granted' })
        }

        const user = await userModelSchema.findOne({ _id: verifyToken.id })

        if(!user){
            return res.status(404).json({ message: 'User not found' })
        }

        req.user = user

        next()

    }catch(error){
        res.status(500).json({ message: 'sorry only logged in users can access this page.' })
    }
}

const statusCheck = async(req, res, next) =>{
    try{
  
        const authHeader = req.header('Authorization')
        const splitHeader = authHeader.split(" ")
        const token = splitHeader[1]
        
        const signature = jwt.verify(token, process.env.ACCESS_TOKEN)

        if(!signature){
           return res.status(400).json({ message: 'Token not verified' })
        }

        const user = await userModelSchema.findOne({ _id: signature.id})

        if(!user){
            return res.status(404).json({ message: 'User not found' })
        }

        if(user.active === false ){
            return res.status(400).json({ message: 'Account deactivated! Reactivate account to access this page.' })
        }

        // req.info = user

        next()

    }catch(error){
        res.status(500).json({ message: error.message })
    }
}

const adminAuth = async(req, res, next) => {
    try {
        const header = req.header('Authorization')
        const splitHeader = header.split(" ")

        const token = splitHeader[1]

        if(!token || token === null){
            return res.status(500).json({ message: 'Error occurred' })
        }

        const verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN)

        if(!verifyToken){
            return res.status(400).json({ message: 'Token not valid' })
        }

        const admin = await adminModelSchema.findOne({ _id: verifyToken.id })

        if(!admin){
            return res.status(400).json({ message: 'User not found' })
        }

        if(verifyToken.role !== 'admin'){
            return res.status(400).json({ message: 'Access denied' })
        }

        // req.user = user

        next()

    }catch(err){
        return res.status(500).json({ message: 'Access denied/Login to gain access.' })
    }
}

module.exports = {
    tokenVerification,
    statusCheck,
    adminAuth
}