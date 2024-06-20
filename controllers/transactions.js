const { default: mongoose } = require('mongoose')
const { transactionModelSchema } = require ('../model/schema')

const mailer = require('../utilities/mailer')

const { mailIncomeHistory, mailExpensesHistory } = require('../view/mailbody')

// handle create transaction for a specified user
const createTransaction = async (req, res) => {
    const { userID, user, type, date, category, amount, description } = req.body
    const { id, username } = req.user

    try{

        // capitalize  letter of users transaction type
        const capitalizeToLower = `${ type.charAt(0).toUpperCase() }${type.slice(1).toLowerCase()}`
        const categoryCapitalize = `${ category.charAt(0).toUpperCase() }${category.slice(1).toLowerCase()}`

        const transaction = new transactionModelSchema({
            userID: id,
            user: username,
            type: capitalizeToLower,
            date,
            category: categoryCapitalize,
            amount,
            description
        })

        await transaction.save()

        if(!transaction){
            return res.status(400).json({ message: 'error creating transaction' })
        }

        return res.status(200).json({ message: 'transaction created successfully', transaction, capitalizeToLower })

    }catch(error){
        return res.status(500).json({ message: error.message })
    }
}


// Get all transactions for a user

const userTransactions = async (req, res) =>{
    const { id, username } = req.user

    try{
        const transactions = await transactionModelSchema.find({ userID: id })


        if(!transactions.length > 0){
            return res.status(400).json({ message: 'Oops! No transactions made yet.' })
        }

        return res.status(200).json({ message: `${ username } below are your transactions`, totalTransactions: `you have a total of ${transactions.length} transactions` , transactions })

    }catch(error){
        return res.status(500).json({ message: error.message })
    }
}

// Get single transaction by id for user

const singleTransaction = async(req, res) => {
    const { id } = req.params

    try{

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: 'No Transaction with such ID.' })
        }

        const transaction = await transactionModelSchema.findById(id)
        
        if(!transaction){
            return res.status(400).json({ message: 'Error querying data' })
        }

        return res.status(200).json({ message: 'Query Successful', transaction })

    }catch(err){
        return res.status(500).json({ message: err.message })
    }
}

// edit single transaction

const editSingleTransaction = async(req, res) => {
    const { type, date, description, category, amount } = req.body
    const { id } = req.params

    // const capitalizeToLower = `${ type.charAt(0).toUpperCase() }${type.slice(1).toLowerCase()}`

    try{

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: 'No transaction with such id found' })
        }

        const editTransaction = await transactionModelSchema.findByIdAndUpdate(
            id,
            {
                type,
                date,
                description,
                category,
                amount
            },
            {
                new: true
            }
        )

        if(!editTransaction){
            return res.status(400).json({ message: 'Error editing records' })
        }

        return res.status(200).json({ message: 'Records edited successfully', editTransaction })

    }catch(err){
        return res.status(500).json({ message: err.message })
    }
}

// delete single transaction

const deleteSingleTransaction = async (req, res) => {
    const { id } = req.params
    try {

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: 'Invalid transaction id' })
        }

        const deleteOneById = await transactionModelSchema.findByIdAndDelete(id)

        if(!deleteOneById){
            return res.status(400).json({ message: 'Error deleting transaction' })
        }
        return res.status(200).json({ message: `Transaction with Id:${ id } has been deleted` })

    }catch(err){
        return res.status(500).json({ message: err.message })
    }
}

// delete all transaction

const deleteAllTransactions = async (req, res) => {
    const { id } = req.user

    try{
        const deleteAll = await transactionModelSchema.find({ userID: id }).deleteMany()

        if(!deleteAll.length > 0){
            return res.status(400).json({ message: 'No transaction made so far.' })
        }

        if(!deleteAll){
           return res.status(400).json({ message: 'An error occurred' })
        }

        return res.status(200).json({ message: 'All Transactions deleted successfully', deleteAll })

    }catch(err){
        res.status(500).json({ message: err.message })
    }
}

// categorize by EXPENSES || INCOME

const filterByType = async (req, res) => {
    let { type } = req.params
    const { id } = req.user

    // capitalizeToLower (convert users entry to match type on schema)
    const capitalizeToLower = `${ type.charAt(0).toUpperCase() }${ type.slice(1).toLowerCase() }`

    type = capitalizeToLower

    try{

        if((type !== 'Expenses') && (type !== 'Income')){
            return res.status(400).json({ message: 'No transaction with such type' })
        }

        const filter = await transactionModelSchema.findOne({ userID: id }).find({ type }).sort({ createdAt: -1 })
        if(!filter){
            return res.status(400).json({ message: 'Error filtering by type' })
        }

        if(!filter.length > 0 ){
            return res.status(400).json({ message: `Oops! you have not made any transaction on ${ type } based type` })
        }

        return res.status(200).json({ message: 'Filter was successful', filter_length: filter.length, filter})
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}

// filter by categories

const filterByCategory = async (req, res) => {
    let { category } = req.params
    const { id } = req.user

    // covert user search params to lowercase
    const searchParams = `${ category.charAt(0).toUpperCase() }${ category.slice(1).toLowerCase() }`
    
    category = searchParams

    try{
        if(category===""){
            return res.status(400).json({ message: 'Please provide a category to search.' })
        }

        const FilterByCategory = await transactionModelSchema.findOne({ userID: id }).find({ category }).sort({ createdAt: -1 })

        if(!FilterByCategory){
            return res.status(400).json({ message: 'Error filtering by category' })
        }

        if(!FilterByCategory.length > 0){
            return res.status(400).json({ message: `No Transaction found based on ${ category }` })
        }

        return res.status(200).json({ message: `Found ${ FilterByCategory.length } transaction based on ${ category } category`, FilterByCategory })


    }catch(error){
        res.status(500).json({ message: error.message })
    }
}

// Filter by amount Range
const filterByAmount = async (req, res) => {
    const { amount } = req.params
    const { id } = req.user

    try{
        if(!Number(amount)){
           return res.status(400).json({ message: 'Value for price can only be number' })
        }

        const findAmount = await transactionModelSchema.find({ userID:id, amount }).sort({ createdAt: -1 })

        if(!findAmount.length > 0){
           return res.status(400).json({ message: 'No transaction with such amount'})
        }
        return res.status(200).json({ message: 'Query Successful', query_length: findAmount.length, findAmount})
        
    }catch(err){
       return res.status(500).json({ message: err.message })
    }
}


// Total expenses made

const totalExpenses = async(req, res) => {
    const { id } = req.user

    try{

        const user = await transactionModelSchema.find({ userID: id, type: 'Expenses' })

        let total = user.reduce((currAmount, userExpenses)=>{
            let calcTotalExpenses = Number(currAmount) + Number(userExpenses.amount)
            return calcTotalExpenses
        }, 0)
        

        res.status(200).json({ message: 'Query Successful', Total_amount_on_expenses: total})
    }catch(error){
        return res.status(500).json({ message: error.message })
    }
}

// Total Income 

const totalIncome = async(req, res) => {
    const { id } = req.user

    try{
        const user = await transactionModelSchema.find({ userID: id, type: 'Income'})

        let total = user.reduce((currAmount, userIncome)=>{

            let calcTotalIncome = Number(currAmount) + Number(userIncome.amount)
            return calcTotalIncome
        }, 0)

        return res.status(200).json({ message : 'Query Successful', Total_amount_on_income: total})

    }catch(error){
       return res.status(500).json({ message: error.message })
    }
}

// mail user total income transaction 

const mailIncomeTransaction = async (req, res) => {

   const { id, email } = req.user

    try{

        const user = await transactionModelSchema.find({ userID: id, type: 'Income'})

        if(!user){
            return res.status(400).json({ message : 'User not found' })
        }

        const calcTotal = user.reduce((currentIncome, userIncome)=>{
            const result = Number(currentIncome) + Number(userIncome.amount)
            return result
        }, 0)

        
        // mail subject
        const subject = "Income Transaction History"
        
        // mail body 
        const body = mailIncomeHistory(user, calcTotal)

        // mail to user

        await mailer(email, subject, body)

        return res.status(200).json({ message: 'Transaction history sent to your mail.', user, calcTotal })

    }catch(error){
        return res.status(500).json({ message: error.message })
    }
}


// mail user total expenses transaction 

const mailExpensesTransaction = async (req, res) => {

    const { id, email } = req.user
 
     try{
 
         let user = await transactionModelSchema.find({ userID: id, type: 'Expenses'}).sort({ createdAt: -1 })
 
         if(!user){
             return res.status(400).json({ message : 'User not found' })
         }
 
         const calcTotal = user.reduce((currentIncome, userIncome)=>{
             const result = Number(currentIncome) + Number(userIncome.amount)
             return result
         }, 0)
 
         
         // mail subject
         const subject = "Expenses Transaction History"
         
         // mail body 
         const body = mailExpensesHistory(calcTotal, user)
 
         // mail to user
 
         await mailer(email, subject, body)
 
         return res.status(200).json({ message: 'Transaction history sent to your mail.', user, calcTotal })
 
     }catch(error){
         return res.status(500).json({ message: error.message })
     }
 }




// controllers export

module.exports = {
    createTransaction,
    userTransactions,
    singleTransaction,
    editSingleTransaction,
    deleteSingleTransaction,
    deleteAllTransactions,
    filterByType,
    filterByCategory,
    filterByAmount,
    totalExpenses,
    totalIncome,
    mailIncomeTransaction,
    mailExpensesTransaction
}