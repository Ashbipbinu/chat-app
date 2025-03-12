import express from 'express'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";

import authRoutes from './Routes/auth.route.js'
import { connectDB } from './lib/db.js'

const app = express()
app.use(express.json())
app.use(cookieParser());

dotenv.config()


// Routes
app.use("/api/auth", authRoutes) 

const PORT = 5000 || process.env.PORT

app.listen(PORT, () => {  
    connectDB()
    console.log(`Server is listening to PORT: ${PORT}`)
})