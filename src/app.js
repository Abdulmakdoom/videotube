import express from "express"; // import for asynchronous // require for synchronus working
import cors from "cors"; // provide security mean Example - Ghar kay ander sbko allow mat kro jinko allow(Whitelist)/link/user kya ha sirf unko hi allow kro
import cookieParser from "cookie-parser"; // npm i cookie-parser cors

// Yes, if you use cookie-parser in your main file (typically where you set up your Express application), it can be accessed across other files, but there are some things to keep in mind.
// When you add cookie-parser as middleware in your main file, it makes the req.cookies object available for all routes and files that are part of your Express application, as long as they are part of the same request-response cycle.



// // middleware - bech main checking krta hai like userid and password shi h ya nhi

// const app = express()

// // app.use() It is used for only Middleware
// app.use(cors( {
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// })) 


// app.use(express.json({limit: "16kb"})) // ish limit tak json data chiye
// // url part
// app.use(express.urlencoded({extended: true, limit: "16kb"})) // extended --- we can give object inside the object like nested way
// app.use(express.static("public"))
// app.use(cookieParser()) // server sai User kay browser ki cookie ko access bhi kr paau aur usay set(edit) bhi kr paau via CRUD operation


// //routes import  ( userRouter -- apni marzi sai tabhi name day saty hai agar "export default" ho raha ho)
// import userRouter from "./routes/user.routes.js"


// //routes declaration

// //----app.get isly use kr rahay thay kyu ki hum yahi router aur controller likh rahe tha so in this we use app.use bcz router/controller alag alag jgha hai
// // ab router ko lany ka liya middleware lana hoga 
// app.use("/api/v1/users", userRouter) // ispar jatay hii userRouter ko activate krdo

// // http://localhost:8080/api/v1/users/register
// export { app }  



const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userRouter from './routes/user.routes.js'
import healthcheckRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)

// http://localhost:8000/api/v1/users/register

export { app }







// 1. app.use(express.json({ limit: "16kb" })):
// This middleware parses incoming requests with JSON payloads. The limit: "16kb" option limits the size of the incoming request body to 16 kilobytes. If the body exceeds this limit, Express will automatically respond with an error.

// 2. app.use(express.urlencoded({ extended: true, limit: "16kb" })):
// This middleware parses URL-encoded data (such as form submissions). The extended: true option allows the parsing of complex objects and arrays in the query string. The limit: "16kb" option limits the size of the incoming URL-encoded request body to 16 kilobytes.

// 3. app.use(express.static("public")):
// This serves static files (like images, CSS, JavaScript) from the public directory. Any request for a file in the public folder will be handled directly by Express without needing to route it through a controller.

// 4. app.use(cookieParser()):
// This middleware parses cookies attached to incoming requests. The cookie-parser middleware makes the cookies available via req.cookies. You can use it to read and manipulate cookies in your Express app.