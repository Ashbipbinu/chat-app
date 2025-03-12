import express from 'express'
import { checkAuth, logInController, logOutController, signUpController, updateProfile } from '../Controllers/auth.controller.js'
import { protectedUser } from '../Middlewares/auth.middleware.js'

const router = express.Router()

router.post('/signup', signUpController)
router.post('/login', logInController)
router.post('/logout', logOutController)
router.get('/check-auth', protectedUser, checkAuth)

router.put('/update-profile', protectedUser, updateProfile)

export default router 