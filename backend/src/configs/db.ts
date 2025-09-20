import mongoose from "mongoose";
import getErrorMessage from "../utils.js";

if (!process.env.MONGODB_URI) {
    throw new Error('MongoDB uri missing in environment variables')
}

const URI = process.env.MONGODB_URI

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('Database connected'))
        await mongoose.connect(URI)
    } catch (error) {
        console.log(getErrorMessage(error));
    }
}

export default connectDB