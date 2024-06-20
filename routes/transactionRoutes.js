const express = require ('express')

const {
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
} = require('../controllers/transactions')

const { 
    transactionAuth
} = require('../middlewares/authentication')
const {
    tokenVerification,
    statusCheck
} = require ('../middlewares/authorization')



const router = express.Router()


// transactions route

router.post('/add-transaction', tokenVerification, statusCheck, transactionAuth, createTransaction)

router.get('/transactions', tokenVerification, statusCheck, userTransactions)

router.get('/transactions/single/:id', tokenVerification, statusCheck, singleTransaction)

router.patch('/transactions/edit/:id', tokenVerification, statusCheck, editSingleTransaction)

router.delete('/transactions/delete/:id', tokenVerification, statusCheck, deleteSingleTransaction)

router.delete('/transactions/delete', tokenVerification, statusCheck, deleteAllTransactions)

router.get('/transactions/filter-by-type/:type', tokenVerification, statusCheck, filterByType)

router.get('/transactions/filter-by-category/:category', tokenVerification, statusCheck, filterByCategory)

router.get('/transactions/filter-by-amount/:amount', tokenVerification, statusCheck, filterByAmount)

router.get('/transactions/total-expenses', tokenVerification, statusCheck, totalExpenses)

router.get('/transactions/total-income', tokenVerification, statusCheck, totalIncome)

router.get('/transactions/mail-income-history', tokenVerification, statusCheck, mailIncomeTransaction)

router.get('/transactions/mail-expenses-history', tokenVerification, statusCheck, mailExpensesTransaction)





module.exports = router