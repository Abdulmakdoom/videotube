import express from "express";
import cors from "cors"; 
import cookieParser from "cookie-parser"; 


const app = express()


// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,  // Allow credentials (cookies)
//     }))


const allowedOrigins = ['https://videotube-frontend-one.vercel.app', "http://localhost:5173"];
// const allowedOrigins = [process.env.CORS_ORIGIN, "http://localhost:5173"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // allow cookies/auth headers
}));


// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN);
//     res.header("Access-Control-Allow-Credentials", "true");
//     res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
//     if (req.method === "OPTIONS") {
//       return res.sendStatus(204);
//     }
  
//     next();
//   });


//const allowedOrigins = [process.env.CORS_ORIGIN, "http://localhost:5173"];
// const allowedOrigins = "https://videotube-frontend-uvlu.onrender.com";

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true, // Allow cookies and other credentials
// }));

  
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// app.use('/', (req, res)=>{
//     res.send("Done")
// })
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
app.use(`/api/v1/videos`, videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)


// Global error handler (must be at the bottom)
import { ApiError } from "./utils/ApiError.js";


app.use((err, req, res, next) => {
    console.error("Error:", err);

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            statusCode: err.statusCode,
            errors: err.errors || []
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        statusCode: 500,
        errors: []
    });
});


export { app }

