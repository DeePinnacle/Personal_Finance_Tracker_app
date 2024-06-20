const { 
    userModelSchema,
    transactionModelSchema,
    adminModelSchema 
} = require('../model/schema')

const jwt = require ('jsonwebtoken')

require('dotenv').config()

// admin login
const adminLogin = async (req, res) => {
    const { username, password } = req.body

    if(!username || !password){
        return res.status(400).json({ message: 'All fields required' })
    }

    const user = await adminModelSchema.findOne({ username })

    if(!user){
        return res.status(400).json({ message: 'User not found.' })
    }

    if(user.role !== 'admin'){
        return res.status(400).json({ message: 'Access denied' })
    }

    const payloads = {
        id: user._id,
        role: user.role
    }

    const token = jwt.sign(payloads, process.env.ACCESS_TOKEN, { expiresIn: '1d' })
    res.cookie('token', token, { httpOnly: true, maxAge: 360000 })

    res.status(200).json({ message: 'Login successful', token, user })

}

// admin reg route

const regAdmin = async (req, res) =>{

    try {

        const admin = new adminModelSchema({
            email: "info@admin.com",
            username: "admin",
            password: "admin123"
        })

        await admin.save()

        return res.status(200).json({ message: "Admin created successfully"})

    }catch(err){
        return res.status(500).json({ message: err.message })
    }
}


const getAllUsers = async(req, res) =>{
    
    try{
        const users = await userModelSchema.find({}).sort({ createdAt: -1 })

        if(!users){
            return res.status(400).json({ message: 'An error occurred' })
        }

        if(!users.length > 0){
            return res.status(400).json({ message: 'Oops! no registered users yet.' })
        }

        return res.status(200).json({ message: 'Query successful', total_user: users.length, users })

    }catch(err){
        res.status(500).json({ message: err.message })
    }
}


const getAllTransactions = async(req, res) =>{
    
    try{
        const transactions = await transactionModelSchema.find({}).sort({ createdAt: -1 })

        if(!transactions){
            return res.status(400).json({ message: 'An error occurred' })
        }

        if(!transactions.length > 0){
            return res.status(400).json({ message: 'Oops! no transaction yet.' })
        }

        return res.status(200).json({ message: 'Query successful', total_transactions: transactions.length, transactions })

    }catch(err){
        res.status(500).json({ message: err.message })
    }
}

// delete a transaction 

const deleteSingleTransaction = async(req, res)=>{
    const { id } = req.params

    try{
        
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: 'Request not completed' })
        }
        
        const transactionId = await transactionModelSchema.findByIdAndDelete(id)

        if(!transactionId){
            return res.status(400).json({ message: 'Error deleting transaction.' })
        }

        return res.status(200).json({ message: 'Transaction deleted successfully.' })

    }catch(error){

    }
}

const deleteUser = async(req, res) => {
    const { id } = req.params

    try{

        
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: 'Invalid user ID' })
        }
        
        const user = await userModelSchema.findByIdAndDelete(id)

        if(!user){
            return res.status(400).json({ message: 'User not found' })
        }

        return res.status(200).json({ message: 'User successfully deleted' })

    }catch(err){
        return res.status(500).json({ message: err.message })
    }
}

// block user

const blockUser = async(req, res) =>{
    const { id } = req.params
    
    try{

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: 'Invalid user ID' })
        }

        const user = await userModelSchema.findById(id)

        if(!user){
            return res.status(400).json({ message: 'User not found' })
        }

        if(user.active === false){
            return res.status(400).json({ message: 'User already blocked.' })
        }

        const updateActive = await userModelSchema.findByIdAndUpdate(id, {
            active: false
        }, { new: true })

        return res.status(200).json({ message: 'User account blocked successfully' })


    }catch(error){
        return res.status(500).json({ message: err.message })
    }
}



// unblock user

const unblockUser = async(req, res) =>{
    const { id } = req.params
    
    try{

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: 'Invalid user ID' })
        }

        const user = await userModelSchema.findById(id)

        if(!user){
            return res.status(400).json({ message: 'User not found' })
        }

        if(user.active === true){
            return res.status(400).json({ message: 'User account is active.' })
        }

        const updateActive = await userModelSchema.findByIdAndUpdate(id, {
            active: true
        }, { new: true })

        return res.status(200).json({ message: 'User account unblocked successfully' })


    }catch(error){
        return res.status(500).json({ message: err.message })
    }
}









module.exports = {
    getAllUsers,
    getAllTransactions,
    deleteUser, 
    deleteSingleTransaction,
    blockUser, 
    unblockUser,
    adminLogin,
    regAdmin
}