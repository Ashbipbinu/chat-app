import express from 'express'
import { logInController, logOutController, signUpController } from '../Controllers/auth.controller.js'

const router = express.Router()

router.post('/signup', signUpController)
router.post('/login', logInController)
router.post('/logout', logOutController)


export default router