import express from "express";
import cors from "cors"; 
import cookieParser from "cookie-parser"; 
import session from "express-session"


const app = express()

const allowedOrigins = [process.env.CORS_ORIGIN, "http://localhost:5173"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // allow cookies/auth headers
}));


  
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// 3. Session
// app.use(session({
//     secret: process.env.ACCESS_TOKEN_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {   
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production", // <-- toggles on HTTPS only
//       sameSite: "lax",                              // you need None for cross-site
//       maxAge: 1000 * 60 * 60 * 24,                    // 1 day
//     }
//   }));

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

