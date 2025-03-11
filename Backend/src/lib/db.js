import mongoose from 'mongoose';

export const connectDB = async (req, res) => {
    console.log("Initializing connection with Database");

    try {
        const conn = await mongoose.connect(process.env.MONGODB); 
        console.log(`Successfully connected to database: ${conn.connection.host}`); 
        
    } catch (error) {  
        console.log("Error occurred while connecting with Database" + " " + error); 
    }  
} 
