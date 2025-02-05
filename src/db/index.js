import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        //console.log(connectionInstance);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1) // isko padhna hai // terminates the process with a failure code
    }
}

export default connectDB



// async function connectDB () {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
// }

//  connectDB.then(()=> {
//     console.log('connection succesfull');
    
//  })