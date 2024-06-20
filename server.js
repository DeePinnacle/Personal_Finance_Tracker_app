// requiring dependencies
require ('dotenv').config()
const express = require('express')
const cors = require('cors')

// require db files
const connectDB = require('./db/dbconnect')

// require router file
const userRouter = require('./routes/userRoutes')
const transactionRouter = require('./routes/transactionRoutes')
const adminRouter = require('./routes/adminRoutes')

const app = express()

const PORT = process.env.PORT || 5000


// middlewares registration
app.use(express.json())
app.use(cors())
app.use((req, res, next)=>{
    console.log(req.method, req.path)
    next()
})

// connect to database
connectDB()

// listen to port 
app.listen(PORT, ()=>{
    console.log(`server listening to port ${ PORT }`)
})

// route
app.use('/finance-tracker/api', userRouter)
app.use('/finance-tracker/api', transactionRouter)
app.use('/finance-tracker/api', adminRouter)