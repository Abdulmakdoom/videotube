import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"



const toggleLike = asyncHandler(async (req, res) => {
    const {type, Id} = req.params
    //TODO: toggle like on video
    const userId = req.user._id; // Logged-in user



    if (!isValidObjectId(Id)) {
        throw new ApiError(400, "Invalid Video ID");
    }

    if(!['video', 'comment', 'tweet'].includes(type)) {
        throw new ApiError(400, 'Invalid content type');
    }

    // Check if the like already exists
    const existingLike = await Like.findOne({
        [type]: Id,
        likedBy: userId,
    });

    if (existingLike) {
        // unLike (Remove from database)
        await Like.deleteOne({ _id: existingLike._id });

        return res.status(200).json(
            new ApiResponse(200, null, "Unlike successfully")
        );
    } else {
        // Like (Add to database)
        await Like.create({
            [type]: Id,
            likedBy: userId,
        });
    };  

        // Count total likes for the given type
    const likeCount = await Like.countDocuments({ [type]: Id });

    return res.status(200).json(
        new ApiResponse(200, { likeCount }, existingLike ? "Unlike successfully" : `${type} Like successfully`)
    );
   
})

const getLikedVideos = asyncHandler(async (req, res) => {
    // console.log(req.user._id);
    
    //TODO: get all liked videos
    let likedVideos = await Like.aggregate([
        {
            $match : {
                likedBy: new mongoose.Types.ObjectId(req.user._id),
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "likedVideos",
                pipeline: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'owner',
                            foreignField: '_id',
                            as: 'owner',
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            videoFile: 1,
                            thumbnail: 1,
                            createdAt: 1,
                            description: 1,
                            title: 1,
                            duration: 1,
                            owner: {
                                _id: 1,
                                username: 1,
                                avatar: 1,
                            },
                        }
                    }
                ]
            }
        },
        {
            $unwind: '$likedVideos',
        },
        {
            $lookup: {
                from: "users",
                localField: "likedBy",
                foreignField: "_id",
                as: "likedByDetails"
            }
        },
        {
            $unwind: "$likedByDetails"
        },
        {
            $sort: { 'likedVideos.createdAt': -1 },
        },
        {
            $project: {
                _id: 1,
                createdAt: 1,
                updatedAt: 1,
                likedVideos: 1,
                likedBy: {
                    _id: "$likedByDetails._id",
                    username: '$likedByDetails.username',
                    avatar: '$likedByDetails.avatar',
                },
                // likedByDetails: {
                //     _id: 1,
                //     username: 1,
                //     avatar: 1,
                // },
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200,likedVideos, 'Liked videos'));
})

const getAllVideoLikes = asyncHandler(async (req, res)=> {
    const {id} = req.params;

    const video = await Like.find({video: {$in: id}})
    //console.log(video);
    
    const LikeVideoCount = await Like.countDocuments({video: id})

    return res.status(200).json(
        new ApiResponse(200, {video, LikeVideoCount}, "success")
    );
})

const getVideoCommentLikes = asyncHandler(async(req, res)=> {
    const {commentId} = req.params;
    
    //console.log(commentId);

    const likeComment = await Like.find({comment: {$in: commentId}})
    const LikeCommentCount = await Like.countDocuments({comment: commentId})

    return res.status(200).json(
        new ApiResponse(200, {likeComment, LikeCommentCount}, "success")
    );
})


const getPostLikes = asyncHandler(async(req, res)=> {
    const {postId} = req.params;
    //console.log(postId);
    
    //console.log(commentId);

    const likePost = await Like.find({tweet: {$in: postId}})
    const LikePostCount = await Like.countDocuments({tweet: postId})

    return res.status(200).json(
        new ApiResponse(200, {likePost, LikePostCount}, "success")
    );
})


// export {
//     toggleCommentLike,
//     toggleTweetLike,
//     toggleVideoLike,
//     getLikedVideos
// }

export {
    toggleLike,
    getLikedVideos,
    getAllVideoLikes,
    getVideoCommentLikes,
    getPostLikes
}