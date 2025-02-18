import mongoose from "mongoose"
import {Video} from "../models/video.models.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const userId = req.user?._id;


    if (!userId) {
        throw new ApiError(401, 'Unauthorized');
    }
    
    const [totalSubscribers, totalVideos] = await Promise.all([   // Both queries run at the same time.
        Subscription.countDocuments({ channel: userId }),
        Video.aggregate([
            { $match: { owner: userId } },
            {
                $group: {
                    _id: null,
                    totalVideos: { $sum: 1 },
                    totalViews: { $sum: "$views" },
                    totalLikes: { $sum: "$likes" }
                }
            }
        ])
    ]);

    const channelStats = {
        totalSubscribers,
        totalVideos: totalVideos[0]?.totalVideos || 0,
        totalViews: totalVideos[0]?.totalViews || 0,
        totalLikes: totalVideos[0]?.totalLikes || 0
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