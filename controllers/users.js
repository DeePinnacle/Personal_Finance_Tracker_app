const bcrypt = require('bcrypt')
const jwt = require ('jsonwebtoken')
require("dotenv").config()

const mailer = require('../utilities/mailer')

const {
    verifyAccount,
    resetPass
} = require('../view/mailbody')

const {
    userModelSchema,
    transactionModelSchema
} = require('../model/schema')

const registration = async(req, res)=>{
    const { username, password, email } = req.body

    // convert username and email to lowercase
    const usernameToLowerCase =  username.toLowerCase()
    const emailToLowerCase = email.toLowerCase()

    try{
        // const user = new userModelSchema({ username, password, email })
        // await user.save()

        // check if email already exist in database
        const emailExist = await userModelSchema.findOne({ email })
        
        if(emailExist){
            return res.status(400).json({ message: 'sorry email already in use.' })
        }

        // check if username already in use
        const usernameExist = await userModelSchema.findOne({ username })
        if(usernameExist){
            return res.status(400).json({ message: "sorry username already in use."  })
        }

        // hash user password
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await userModelSchema.create({ username: usernameToLowerCase, password: hashedPassword, email:emailToLowerCase })

        // create payload for user

        const payloads = { 
            id: user._id,
            username: user.username,
            email: user.email
        }

        const token = jwt.sign(payloads, process.env.ACCESS_TOKEN, { expiresIn: '1d' })

        // set res cookie
        res.cookie('token', token, { httpOnly: true, maxAge: 36000 })

        // send welcome message and verify account

        const verifyLink = `http://localhost:5000/finance-tracker/api/verify-account/${ token }`

        const subject = 'Verify email account'

        let body = verifyAccount(username, verifyLink)

        await mailer( email, subject, body )

        return res.status(200).json({ message: ' Check you mail to verify account. ', user, verifyLink, token })


    } catch(error){
        return res.status(500).json({message:error.message})
    }
}

// verify account

const accountVerification = async(req, res)=>{
    const { token } = req.params

    try{

        if(!token || token === null){
            return res.status(400).json({ message: 'Something went wrong.' })
        }

        const decode = jwt.verify(token, process.env.ACCESS_TOKEN)
        
        const id = decode.id

        const user = await userModelSchema.findById(id)

        if(!user){
            return res.status(400).json({ message: 'User not found', decode, token })
        }

        if(user.active === false){
            return res.status(400).json({ message: 'Account deactivated' })
        }

        if(user.verified === true){
            return res.status(400).json({ message: 'Account already activated'} )
        }

        const verifyUserAccount = await userModelSchema.findByIdAndUpdate(id, {
            verified: true
        }, { new: true })

        if(!verifyUserAccount){
            return res.status(400).json({ message: 'Error verifying email.' })
        }

        return res.status(200).json({ message: 'Account successfully verified. Now proceed to login.' })

    }catch(error){
        return res.status(500).json({ message: error.message })
    }
}

// login function
const login = async (req, res) => {
    const { username, password } = req.body

    // convert username and email to lowercase
    const usernameToLowerCase =  username.toLowerCase()
    // const emailToLowerCase = email.toLowerCase()

    try{
        const user = await userModelSchema.findOne({ username: usernameToLowerCase })

        // check if user details exist
        if(!user){
            return res.status(200).json({message: "invalid user credentials"})
        }

        // compare password 
        const matchPassword = await bcrypt.compare(password, user.password)
        if(!matchPassword) {
            return res.status(400).json({ message: "incorrect username or password"})
        }

        if(user.verified === false){
            return res.status(400).json({ message: 'Account not verified!, please check your mail and verify account.' })
        }

        // get user payload
        const payloads = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        // create user access token 
        const accessToken = jwt.sign(payloads, process.env.ACCESS_TOKEN)

        // set token cookie
        res.cookie('token', accessToken, { httpOnly: true, maxAge: 360000 })

        return res.status(200).json({ message: `welcome ${ username }`, user, accessToken})


        
    }catch(error){
        return res.status(500).json({ message: error.message })
    }
}

const logout = async(req, res) => {
    res.clearCookie('token')

    return res.status(200).json({ message: 'Successfully logged out.'})
}

// Update user records
const editRecords = async(req, res)=>{
    
    const { username, password, email } = req.body
    const { id } = req.user

    try{
        const findUser =  await userModelSchema.findById(id)

        if(!findUser){
            return res.status(400).json({ message: 'User not found' })
        }

        const updateRecords = await userModelSchema.findByIdAndUpdate(
            id,
            {
                username,
                password,
                email
            },
            {
                new: true
            }
        )
        if(!updateRecords){
            return res.status(401).status({ message: 'Error updating records' })
        }

        return res.status(200).json({ message: 'Records updated successfully', updateRecords })

    }catch(error){
        return res.status(500).json({ message: error.message })
    }

    
}

// delete account
const deleteAccount = async (req, res) => {
    const { id } = req.user

    try{
        const deleteTransactions = await transactionModelSchema.find({ userID: id}).deleteMany()
        const deleteAcct = await userModelSchema.findByIdAndDelete(id)

        if(!(deleteAcct || deleteTransactions)) {
           return res.status(401).json({ message: 'Error deleting accounting' })
        }
        return res.status(200).json({ message: 'Account deleted successfully' })
    }catch(error){
        return res.status(500).json({ message: error.message })
    }

}

// deactivate account

const deactivateAcct = async(req, res) => {
    const { id } = req.user

    try{
        const user = await userModelSchema.findOne({ _id: id })

        if(!user){
            return res.status(400).json({ message: 'No user found' })
        }

        const setUser = await userModelSchema.findByIdAndUpdate(
            id,
            {
                active: false
            },
            {
                new: true
            }
        )

        if(!setUser){
           return res.status(400).json({ message: 'Error deactivating account' })
        }

        return res.status(200).json({ message: 'Deactivation successful', setUser})

    }catch(error){
        return res.status(500).json({ message: error.message })
    }
}


// Activate account

const reactivateAcct = async (req, res) => {
    const { id } = req.user
    
    try{
        const user = await userModelSchema.findOne({ _id: id })

        if(!user){
            return res.status(400).json({ message: 'No user found' })
        }

        const setUser = await userModelSchema.findByIdAndUpdate(
            id,
            {
                active: true
            },
            {
                new: true
            }
        )

        if(!setUser){
           return res.status(400).json({ message: 'Error reactivating account' })
        }

        return res.status(200).json({ message: 'Account Reactivation successful', setUser})

    }catch(error){
        return res.status(500).json({ message: error.message })
    }

}

// forget password

const forgotPassword = async (req, res) => {
    const { email } = req.body

    try{

        const emailRegExPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        if(!email){
            return res.status(400).json({ message: 'Please enter your email' })
        }

        if(!emailRegExPattern.test(email)){
            return res.status(400).json({ message: 'Please enter a valid email address' })
        }


        const user = await userModelSchema.findOne({ email })

        if(!user){
            return res.status(200).json({ message: 'No such email found' })
        }

        // create user payloads

        const payloads = {
            id: user._id,
        }

        // assign a token 

        const token = jwt.sign(payloads, process.env.ACCESS_TOKEN, { expiresIn: '20m' })

        // send mail
        const subject = "Reset Password"

        const resetPassLink = `http://localhost:5000/finance-tracker/api/reset-password/${ token }`

        let body = resetPass(user.username, resetPassLink)

        await mailer(email, subject, body)

        return res.status(200).json({ message: 'Password reset link sent to your email.', resetPassLink, token })

    }catch(error){
        return res.status(500).json({ message: error.message })
    }
}

const resetPassword = async(req, res) => {

    const { token } = req.params
    const { password } = req.body

    try{

        const decode = jwt.verify(token, process.env.ACCESS_TOKEN)

        const id = decode.id

        if(!decode){
            return res.status(400).json({ message: 'An error occurred' })
        }


        const user = await userModelSchema.findById(id)

        if(!user){
            return res.status(400).json({ message: 'User not found' })
        }

        if(user.verified === false){
            return res.status(400).json({ message: 'Oops! kindly verify your account from your mail.' })
        }

        if(user.active === false){
            return res.status(400).json({ message: 'Sorry account deactivated' })
        }

        if(!password){
            return res.status(400).json({ message: 'Please enter your new password' })
        }

        const passRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8}$/

        if(password.length < 8 || passRegEx.test(password)){
            return res.status(400).json({ message: 'Password should be 8 character long and contain at least 1 number and a sign.' })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const updatePassword = await userModelSchema.findByIdAndUpdate(id,{
            password: hashPassword
        }, { new: true })

        if(!updatePassword){
            return res.status(400).json({ message: 'Error resetting password' })
        }

        return res.status(200).json({ message: 'Password reset successfully. Now login', user })

    }catch(error){
        res.status(500).body({ message: message.error })
    }
}

module.exports = {
    login,
    registration,
    editRecords,
    deleteAccount,
    deactivateAcct,
    reactivateAcct,
    accountVerification,
    forgotPassword,
    resetPassword
}