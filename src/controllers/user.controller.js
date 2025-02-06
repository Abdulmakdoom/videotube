import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
// import mongoose from "mongoose";

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
    // res.status(200).json({
    //     message: "ok"
    // })


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
    //console.log("email: ", email);
    
    // if (fullName === "") {   // validation - not empty
    //     throw new ApiError(400, "fullname is required")
    // }
                // OR

    if (   //validation - not empty
        [fullName, email, username, password].some((field) => field?.trim() === "")  // some work like map function working but return porblem 
    ) {
        throw new ApiError(400, "All fields are required")
    }
    
    //--------------------------check if user already exists: username, email
    const existedUser = await User.findOne({  // via mongodb database
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    //--------------------------check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path; // req.files ka access multer deta hai // ? - agr hai to agay badho
    //console.log(req.files);
   
   
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
                        // OR
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }


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
        "-password -refreshToken" // yaha field nhi ayengy data kay saath
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

//--------------------------------------------Login User

const loginUser = asyncHandler(async (req, res)=> {
    
    // steps

    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token generate
    //send these token via cookie

 
    // req body -> data
    const {email, username, password} = req.body
    //console.log(email);

    // username or email
    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    //find the user
    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }
 
    //password check
   const isPasswordValid = await user.isPasswordCorrect(password) // o/p - true or false

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }
 
    //access and referesh token
   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

   // send token via cookies
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {  // now you can't modify cookie throw front-end, you can modify throw server only after true these below line.
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options) // (key, value, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
      
})

//--------------------------------------------Logout User

const logoutUser = asyncHandler(async(req, res) => {
    // steps 

// clear user cookies
// refreshToken in data also reset
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = { 
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})


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
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})




export {registerUser, loginUser, logoutUser, refreshAccessToken}