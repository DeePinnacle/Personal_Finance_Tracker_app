const mongoose = require('mongoose')
const express = require('express')

require('dotenv').config()

const connectDB = async () => {
    await mongoose.connect(`${process.env.MONGO_URI}`)
    .then(()=>{
        console.log(`connected to database successfuly`)
    })
    .catch((error)=>{
        console.log(`error connecting to database ${ error }`)
    })
}

module.exports = connectDB
