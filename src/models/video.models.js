import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; 
import { Comment } from "./comment.model.js";
import {Like} from "./like.model.js";
import { Playlist } from "./playlist.model.js";
import { User } from "./user.models.js";

const videoSchema = new Schema(
    {
        videoFile: {
            type: String, //cloudinary url
            required: true
        },
        thumbnail: {
            type: String, //cloudinary url
            required: true
        },
        title: {
            type: String, 
            required: true
        },
        description: {
            type: String, 
            required: true
        },
        duration: {
            type: Number, 
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        viewers: [
            {
                userId: { type: Schema.Types.ObjectId, ref: "User" },
                timestamp: { type: Date, default: Date.now }
            }
        ],
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }

    }, 
    {
        timestamps: true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)

videoSchema.post("findOneAndDelete", async (video)=> {  // video -- whole video data come
    //console.log(video._id);
    if(video) {
        let comments = await Comment.find({"video": video._id}).select("_id"); 

        // const commentIds = comments.map((comment)=> comment._id)
        // if (commentIds.length > 0) {
        //     await Like.deleteMany({ comment: { $in: commentIds } }); // Delete likes on those comments
        // }

        // Or

        await Promise.all(comments.map(comment=> Like.deleteMany({"comment": { $in: comment}})))

        // await Like.deleteMany({"comment": {$in: video._id}})
        await Like.deleteMany({"video": video._id})
        await Comment.deleteMany({"video": {$in: video._id}})
        await Playlist.updateMany(
            {"videos": video._id},
            { $pull: { "videos": video._id } }
        )
        await User.updateMany(
            {"watchHistory": video._id},
            {$pull: {"watchHistory": video._id}}
        )
    }
})

export const Video = mongoose.model("Video", videoSchema)