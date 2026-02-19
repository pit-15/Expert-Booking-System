import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

export async function ConnectDB()
{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB connected Sucessfully");
    }
    catch(err)
    {
        console.error("Connection Failed",err);
        process.exit(1 );
    }
}