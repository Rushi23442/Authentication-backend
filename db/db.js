import mongoose from "mongoose";
import dotenv from "dotenv";

export const ConnectDB = async () => {
 try {
    await mongoose.connect(process.env.MONGO_URl)
    console.log('DB connected')
 } catch (error) {
    console.log("error",error)
    process.exit(1)
 }
};
