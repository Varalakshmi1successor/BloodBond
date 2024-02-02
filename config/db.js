import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
mongoose
    .connect(process.env.MONGODB_URI,{ 
        
    })
    .then(() => {
        console.log("DB Connected");
    })
    .catch((err) => console.log(err));