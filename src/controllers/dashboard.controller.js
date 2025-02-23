import mongoose from "mongoose"
import {Video} from "../models/video.models.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Comment} from "../models/comment.model.js"
import {Tweet} from "../models/tweet.model.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const userId = req.user?._id;


    if (!userId) {
        throw new ApiError(401, 'Unauthorized');
    }
    
    const [totalSubscribers, totalVideos, totalLikes] = await Promise.all([
        // Count total subscribers
        Subscription.countDocuments({ channel: userId }),
    
        // Get total videos & views
        Video.aggregate([
            { $match: { owner: userId } },
            {
                $group: {
                    _id: null,
                    totalVideos: { $sum: 1 }, 
                    totalViews: { $sum: "$views" } 
                }
            }
        ]),
    
        // Get total likes received by user's content
        Like.aggregate([
            {
                $match: {
                    $or: [
                        { video: { $in: await Video.distinct("_id", { owner: userId }) } },  
                        { comment: { $in: await Comment.distinct("_id", { owner: userId }) } },
                        { tweet: { $in: await Tweet.distinct("_id", { owner: userId }) } }
                    ]
                }
            },
            { $count: "totalLikes" }
        ])
    ]);
    
    const channelStats = {
        totalSubscribers,
        totalVideos: totalVideos[0]?.totalVideos || 0,
        totalViews: totalVideos[0]?.totalViews || 0,
        totalLikes: totalLikes[0]?.totalLikes || 0 // Fixing the totalLikes field
    };
    

    return res.status(200).json(new ApiResponse(200, channelStats, 'Channel stats fetched successfully'));
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    let user = req.user._id;

    let getAllVideos = await Video.find({owner: user})

    return res.status(200).json(new ApiResponse(200, getAllVideos, 'Videos fetched successfully'));
})

export {
    getChannelStats, 
    getChannelVideos
    }