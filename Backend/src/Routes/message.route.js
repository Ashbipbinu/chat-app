import express from 'express';
import { protectedUser } from '../Middlewares/auth.middleware.js';
import { getUserMessages, getUsersForSideBar, sendMessage } from '../Controllers/message.controller.js';

const route = express.Router()

route.get('/users', protectedUser, getUsersForSideBar) //This will get all the users who have messaged to this profile
route.get('/user/:id', protectedUser, getUserMessages)

route.post('/send/:id', protectedUser, sendMessage)

export default route