const express = require('express')

const {
    getAllUsers,
    getAllTransactions,
    deleteUser,
    deleteSingleTransaction,
    blockUser,
    unblockUser,
    adminLogin,
    regAdmin

} = require('../controllers/admin')

const {
    adminAuth
} = require ('../middlewares/authorization')

const router = express.Router()

router.post('/admin/login', adminLogin)
router.post('/admin/register', adminAuth, regAdmin)
router.get('/admin/users', adminAuth, getAllUsers)
router.get('/admin/transactions', adminAuth, getAllTransactions)
router.delete('/admin/delete/:id', adminAuth, deleteUser)
router.delete('/admin/delete/:id', adminAuth, deleteSingleTransaction)
router.patch('/admin/block-user/:id', adminAuth, blockUser)
router.patch('/admin/unblock-user/:id', adminAuth, unblockUser)

module.exports = router