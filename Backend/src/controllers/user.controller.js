import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';


const generateAccessAndRefereshTokens = async(userId)=> {
    try {
       const user = await User.findById(userId)
       const accessToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()

       user.refreshToken = refreshToken
       await user.save({ validateBeforeSave: false }) // validateBeforeSave -- validation kuch mat lagao bus save krdo without validation like password required hai , bcz we don't need to used validation in this place

       return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token ")
    }
}

//--------------------------------------------Register User

const registerUser = asyncHandler( async (req, res) => {
    // Steps -- Logic building

    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response

    //--------------------------get user details from frontend
    const {fullName, email, username, password } = req.body    

    if (   //validation - not empty
        [fullName, email, username, password].some((field) => field?.trim() === "")  
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // email regex validation
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email format");
    }

    // password regex validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    if (!passwordRegex.test(password)) {
        throw new ApiError(
            400,
            "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
        );
    }
    
    //--------------------------check if user already exists: username, email
    const existedUser = await User.findOne({  
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    //console.log(req.files);
    
    //--------------------------check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path; 
    //console.log(req.files);  
   
   
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    //--------------------------upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath)   //  return response;
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   
    //--------------------------create user object - create entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })
    
    //--------------------------remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" 
    )
    //--------------------------check for user creation
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    //--------------------------return response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})

// //--------------------------------------------Login User

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    // Find the user by username or email
    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // Password check
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    // Prepare user data to send back (exclude password and refreshToken)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Define cookie options
    const cookieOptions = {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',  // Use secure cookies only in production
        secure: true,
        sameSite: "none",
    };

    // Send response with cookies
    return res.status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, 
                    accessToken, 
                    refreshToken
                },
                "User logged in successfully"
            )
        );
});

// const loginUser = asyncHandler(async (req, res) => {
//     const { email, username, password } = req.body;
//     if (!username && !email) {
//       throw new ApiError(400, "Username or email is required");
//     }
  
//     const user = await User.findOne({ $or: [{ username }, { email }] });
    
//     if (!user) {
//       throw new ApiError(404, "User does not exist");
//     }
//     const isPasswordValid = await user.isPasswordCorrect(password);
//     if (!isPasswordValid) {
//       throw new ApiError(401, "Invalid user credentials");
//     }
  
//     // 1) Generate tokens
//     const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

//     // 3) Store tokens in session
//     // req.session.tokens = { accessToken, refreshToken };
    
//     req.session.user = {
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//     };
  
//     // 4) Send back user + accessToken so your React app can call protected APIs
//     //    (you could omit sending refreshToken if you handle refresh entirely server-side)
//     const safeUser = await User.findById(user._id).select("-password -refreshToken");

//     return res.status(200).json(new ApiResponse(
//       200,
//       {
//         user: safeUser,
//         accessToken,
//       },
//       "User logged in successfully"
//     ));
//   });
  


// const loginUser = asyncHandler(async (req, res) => {
//     const { email, username, password } = req.body;

//     if (!username && !email) {
//         throw new ApiError(400, "Username or email is required");
//     }

//     // Find the user by username or email
//     const user = await User.findOne({ $or: [{ username }, { email }] });

//     if (!user) {
//         throw new ApiError(404, "User does not exist");
//     }

//     // Password check
//     const isPasswordValid = await user.isPasswordCorrect(password);
//     if (!isPasswordValid) {
//         throw new ApiError(401, "Invalid user credentials");
//     }

//     // Generate access and refresh tokens
//     const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

//     // Prepare user data to send back (exclude password and refreshToken)
//     const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

//     // Send response with tokens
//     return res.status(200)
//         .json(
//             new ApiResponse(
//                 200,
//                 {
//                     user: loggedInUser, 
//                     accessToken, 
//                     refreshToken
//                 },
//                 "User logged in successfully"
//             )
//         );
// });




//--------------------------------------------Logout User

const logoutUser = asyncHandler(async(req, res) => {
    // steps 

// clear user cookies
// refreshToken in data also reset
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 
            }
        },
        {
            new: true
        }
    )

    const options = { 
        httpOnly: true,
        secure: true,
        sameSite: "none",

    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})



// const logoutUser = asyncHandler(async (req, res) => {
//     // 1) Grab the userId from the session (or from req.user if you populated that)
//     // const userId = req.session.user?._id;
//     // if (!userId) {
//     //   throw new ApiError(401, "Not authenticated");
//     // }
  
//     // 2) Remove refreshToken from the User document
//     await User.findByIdAndUpdate(
//       req.user._id,
//       { $unset: { refreshToken: "" } },
//       { new: true }
//     );
  
//     // 3) Clear out tokens from the session
//     delete req.session.tokens;
//     delete req.session.user;
  
//     // 4) Destroy the session entirely
//     req.session.destroy(err => {
//       if (err) {
//         // If destroy fails, still try to clear the cookie
//         console.error("Session destroy error:", err);
//       }
  
//       // 5) Clear the session cookie on the client
//       const cookieOptions = {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "none",
//       };
  
//       res
//         .clearCookie("connect.sid", cookieOptions)  // default cookie name
//         .status(200)
//         .json(new ApiResponse(200, {}, "User logged out successfully"));
//     });
//   });
  

// const logoutUser = asyncHandler(async (req, res) => {
//     const incomingRefreshToken = req.body.refreshToken;
  
//     if (!incomingRefreshToken) {
//       throw new ApiError(400, "Refresh token is required");
//     }
  
//     try {
//       const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  
//       const user = await User.findById(decoded._id);
//       if (!user) {
//         throw new ApiError(404, "User not found");
//       }
  
//       // Clear the refresh token in DB
//       user.refreshToken = null;
//       await user.save();
  
//       return res
//         .status(200)
//         .json(new ApiResponse(200, {}, "User logged out successfully"));
//     } catch (error) {
//       throw new ApiError(401, "Invalid or expired refresh token");
//     }
//   });
  


//-------------------------------------------refresh AccessToken

// we need to create end-point where user can refresh access token after expire access token

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    // got encoded token
    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        // now got decoded token
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
       
        // cookie
        // now send in cookie
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none",

        }
    
        const {accessToken, refreshToken: newRefreshToken} = await generateAccessAndRefereshTokens(user._id);

        return res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", newRefreshToken, options)
          .json(
            new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed")
          );
        
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})



// const refreshAccessToken = asyncHandler(async (req, res) => {
//     // 1) pull the stored refreshToken out of the session
//     const incomingRefreshToken = req.session.tokens?.refreshToken;
//     if (!incomingRefreshToken) {
//       throw new ApiError(401, "Unauthorized — no refresh token in session");
//     }
  
//     let decoded;
//     try {
//       // 2) verify it
//       decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
//     } catch (err) {
//       throw new ApiError(401, "Invalid or expired refresh token");
//     }
  
//     // 3) lookup user and ensure the DB‐stored token matches
//     const user = await User.findById(decoded._id);
//     if (!user || user.refreshToken !== incomingRefreshToken) {
//       throw new ApiError(401, "Refresh token mismatch or user not found");
//     }
  
//     // 4) mint new tokens
//     const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefereshTokens(user._id);
  
//     // 5) overwrite session.tokens with the new ones
//     req.session.tokens = { accessToken, refreshToken: newRefreshToken };
  
//     // 6) send back JSON with the new accessToken (client keeps it in memory)
//     return res.status(200).json(
//       new ApiResponse(
//         200,
//         { accessToken, refreshToken: newRefreshToken },
//         "Tokens refreshed successfully"
//       )
//     );
//   });


// const refreshAccessToken = asyncHandler(async (req, res) => {
//     const incomingRefreshToken =
//       req.body.refreshToken ||
//       req.header("Authorization")?.replace("Bearer ", "").trim();
  
//     if (!incomingRefreshToken) {
//       throw new ApiError(401, "Unauthorized request: No refresh token provided");
//     }
  
//     try {
//       const decodedToken = jwt.verify(
//         incomingRefreshToken,
//         process.env.REFRESH_TOKEN_SECRET
//       );
  
//       const user = await User.findById(decodedToken?._id);
  
//       if (!user) {
//         throw new ApiError(401, "Invalid refresh token (no user)");
//       }
  
//       if (incomingRefreshToken !== user?.refreshToken) {
//         throw new ApiError(401, "Refresh token is expired or has been reused");
//       }
  
//       const {
//         accessToken,
//         refreshToken: newRefreshToken,
//       } = await generateAccessAndRefereshTokens(user._id);
  
//       return res.status(200).json(
//         new ApiResponse(
//           200,
//           { accessToken, refreshToken: newRefreshToken },
//           "Access token refreshed"
//         )
//       );
//     } catch (error) {
//       throw new ApiError(401, error?.message || "Invalid refresh token");
//     }
//   });
  


//-------------------------------------------change current password

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body
    const user = await User.findById(req.user?._id) 
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

     // password regex validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
     if (!passwordRegex.test(newPassword)) {
         throw new ApiError(
             400,
             "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
         );
     }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

//-------------------------------------------get current user

const getCurrentUser = asyncHandler(async(req, res) => {  
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,  
        "User fetched successfully"
    ))
})

//-------------------------------------------update account details

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    // email regex validation
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email format");
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,   
                email: email
            }
        },
        {new: true} 
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

//-------------------------------------------update user avater

const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path  

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avaterUser = await User.findById(req.user?._id);

    const getPublicId = (url) => url.split('/').pop().split('.')[0];
            
    // Delete the avatar file from Cloudinary
    if (avaterUser.avatar) {
        await cloudinary.uploader.destroy(getPublicId(avaterUser.avatar), { resource_type: "image" });
    }
             

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})

//-------------------------------------------update cover image

const updateUserCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    const CoverImageUser = await User.findById(req.user?._id);

    const getPublicId = (url) => url.split('/').pop().split('.')[0];
            
    // Delete the coverImage file from Cloudinary
    if (CoverImageUser.coverImage) {
        await cloudinary.uploader.destroy(getPublicId(CoverImageUser.coverImage), { resource_type: "image" });
    }


    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Cover image updated successfully")
    )
})

//-------------------------------------------subscriber, subscribtions

// step 3  ---- subscribtion method process
const getUserChannelProfile = asyncHandler(async(req, res) => {
    const {username} = req.params  

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    // aggregate pipline  
    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()  
            }
        },
        {
            // to find subscribers or followrs through channel
            $lookup: {
                from: "subscriptions", 
                localField: "_id", 
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions", 
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"  // as: "subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"   //  as: "subscribedTo"
                },
                // follow button 
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]}, 
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            // it give you selected data only not whole data
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ])
   

    // In aggregate pipline o/p --- A array with multiple objects ;
    // but In our care we get only -- A array with one objects bcz we have only 1 match.
    // also see o/p in aggregate pipline mongodb docs


    if (!channel?.length) {
        throw new ApiError(404, "channel does not exists")
    }
    

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
    )
    
})



//-------------------------------------------watch history

const getWatchHistory = asyncHandler(async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)  
            }
        },
        {
            $lookup: { 
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    }, 
                    {
                        $addFields:{  
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )
})


//-------------------------------------------Clear watch history

const clearWatchHistory = asyncHandler(async (req, res) => {
    // Clear the watchHistory array
    await User.updateOne(
        { _id: req.user._id },
        { $set: { watchHistory: [] } }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Watch history cleared successfully"
        )
    );
});


export {registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory,
    clearWatchHistory
}