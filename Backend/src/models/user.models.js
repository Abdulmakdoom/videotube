import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"; 
import bcrypt from "bcrypt"
// import Video from "./video.models.js"


const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, // remove extra space
            index: true 
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [  
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)


userSchema.pre("save", async function (next) {  
    if(!this.isModified("password")) return next(); 

    this.password = await bcrypt.hash(this.password, 10) 
    next()
})


// userSchema.post("findOneAndDelete", async (user)=> {
//     if(user) {
//         await Video.deleteMany({_id: {$in: user.watchHistory}})  //  query is searching for documents where the "_id" field matches any of the values inside "user.watchHistory".  
//     }
// })

//custom method create
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password) 
}


userSchema.methods.generateAccessToken = function(){  // access token 
    return jwt.sign(
        {
            // payload
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){ // Refresh token 
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)