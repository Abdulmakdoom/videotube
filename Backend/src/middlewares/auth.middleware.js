
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js";

// export const verifyJWT = asyncHandler(async(req, _, next) => {
//     try {
//         //  get token
//         // const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
//         // const token = req.cookies?.accessToken
//         const token = (req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "") || "").trim();

//         //console.log(token);
        

//         // console.log(token);
//         if (!token) {
//             throw new ApiError(401, "Unauthorized request")
//         }
    
//         //  decode token
//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
//         const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
//         if (!user) {  
//             throw new ApiError(401, "Invalid Access Token")
//         }
    
//         req.user = user;
//         next()
//     } catch (error) {
//         throw new ApiError(401, error?.message || "Invalid access token")
//     }
    
// })


export const verifyJWT = asyncHandler(async (req, _, next) => {
  // Check if the access token is provided via cookies or Authorization header
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim();

  if (!token) {
      throw new ApiError(401, "Access token missing");
  }

  let decodedToken;
  try {
      // Verify the token
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
      // Handle invalid or expired token
      throw new ApiError(401, "Access token invalid or expired");
  }

  // Find the user associated with the token
  const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

  if (!user) {
      throw new ApiError(401, "User not found for this token");
  }

  // Attach the user to the request object
  req.user = user;

  // Proceed to the next middleware or route handler
  next();
});

  


