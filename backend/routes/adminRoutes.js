import express from 'express'
import { 
    adminLogin,
    adminLogout, 
    getUsers ,
    addNewUser,
    editUser,
    deleteUser
} from '../controllers/adminController.js'
import { adminProtect } from '../middleware/adminAuthMiddleware.js'

const router = express.Router()

router.post('/', adminLogin)
router.post('/logout', adminLogout)
router.route('/users')
.get(adminProtect,getUsers)
.post(adminProtect, addNewUser)
.put(adminProtect, editUser)
.delete(adminProtect, deleteUser)

export default router