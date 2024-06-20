const mongoose = require('mongoose')

const Schema = mongoose.Schema

// user schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    active: {
        type: Boolean,
        default: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'user'
    }
}, { timestamps: true })


// Transaction schema

const transactionSchema = new Schema({
    userID: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    user: [
        {
            type: String,
            ref: 'user'
        }
    ],
    date:{
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Expenses', 'Income'],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    }
},{ timestamps: true })


// admin schema
const adminSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'admin'
    }
}, { timestamps: true })

const userModelSchema = mongoose.model('user', userSchema)
const transactionModelSchema = mongoose.model('transaction', transactionSchema)
const adminModelSchema = mongoose.model('admin', adminSchema)

module.exports = {
    userModelSchema,
    transactionModelSchema,
    adminModelSchema
}