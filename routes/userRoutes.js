const express = require ('express')

const { 
    login,
    registration,
    accountVerification,
    editRecords,
    deleteAccount,
    deactivateAcct,
    reactivateAcct,
    forgotPassword,
    resetPassword
} = require('../controllers/users')


const { 
    regAuthentication,
    loginAuthentication,
} = require('../middlewares/authentication')
const {
    tokenVerification,
} = require ('../middlewares/authorization')


const router = express.Router()



router.post('/register', regAuthentication , registration)

router.post('/login', loginAuthentication, login )

router.patch('/edit-records', tokenVerification, editRecords)

router.delete('/delete-account', tokenVerification, deleteAccount)

router.patch('/deactivate', tokenVerification, deactivateAcct)

router.patch('/reactivate-acct', tokenVerification, reactivateAcct)

router.patch('/verify-account/:token', accountVerification)

router.post('/forgot-password', forgotPassword)

router.patch('/reset-password/:token', resetPassword)


module.exports = router;