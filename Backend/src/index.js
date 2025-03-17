// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
// import MongoStore from 'connect-mongo'
// import session from "express-session";

dotenv.config({
    path: './.env'
})

import connectDB from "./db/index.js";
import {app} from './app.js'


connectDB().then(()=> {
    app.listen(process.env.PORT || 8080, ()=> {
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err)=> {
    console.log("mongo db connection Failed !!! ", err);
})


/*
;( async ()=> {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error", (error)=> { // express don't listion problem detect error 
            console.log("ERR: ", error);
            throw error;
        })

        app.listen(process.env.PORT, ()=> {
            console.log(`App is listining on PORT: ${process.env.PORT}`);
        })
    } catch(error){
        console.error("ERROR: ", error)
        throw err
    }
})() // imediately execute(IFEE)
*/