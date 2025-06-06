
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        //  get token
        // const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        const token = req.cookies?.accessToken

        // const token = req.session.tokens?.accessToken;
        // console.log(token);
        
        // const token = (req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "") || "").trim();
        // const token = (req.header("Authorization")?.replace("Bearer ", "") || "").trim();
        // console.log(token);
        

        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request or AccessToken missing")
        }
    
        //  decode token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {  
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})


