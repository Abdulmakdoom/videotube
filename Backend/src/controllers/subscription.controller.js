import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.models.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

// step 1  ---- subscribtion method process
const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params   
    // TODO: toggle subscription
    const subscriberId = req.user._id; // Logged-in user

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    if (channelId === String(subscriberId)) {
        throw new ApiError(400, "You cannot subscribe to yourself");
    }

    // Check if the subscription already exists
    const existingSubscription = await Subscription.findOne({
        subscriber: subscriberId,
        channel: channelId,
    });

    if (existingSubscription) {
        // Unsubscribe (Remove from database)
        await Subscription.deleteOne({ _id: existingSubscription._id });

        return res.status(200).json(
            new ApiResponse(200, null, "Unsubscribed successfully")
        );
    } else {
        // Subscribe (Add to database)
        await Subscription.create({
            subscriber: subscriberId,
            channel: channelId,
        });

        return res.status(200).json(
            new ApiResponse(200, null, "Subscribed successfully")
        );
    }

})

// controller to return subscriber list of a channel 
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    // Find subscribers
    const subscribers = await Subscription.find({ channel: channelId }).populate(
        "subscriber",
        "fullName username avatar"
    );

    return res.status(200).json(
        new ApiResponse(200, subscribers, "Subscribers fetched successfully")
    );
})
// 1 subscribe then this result

// {
//     "statusCode": 200,
//     "data": [
//         {
//             "_id": "67ac61542b84174cd9e52517",
//             "subscriber": {
//                 "_id": "67ac580572775ad277345c2b",
//                 "username": "zaynzayn1",
//                 "fullName": "zayn1",
//                 "avatar": "http://res.cloudinary.com/dmlw1mz3w/image/upload/v1739347972/wsemwuzqywxc9urtutpj.jpg"
//             },
//             "channel": "67a4d24719711816261b099e",
//             "createdAt": "2025-02-12T08:52:36.653Z",
//             "updatedAt": "2025-02-12T08:52:36.653Z",
//             "__v": 0
//         }
//     ],
//     "message": "Subscribers fetched successfully",
//     "success": true
// }


// {
//     "statusCode": 200,
//     "data": [],
//     "message": "Subscribers fetched successfully",
//     "success": true
// },


// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID");
    }

    // Find all channels the user has subscribed to
    const channels = await Subscription.find({ subscriber: subscriberId }).populate(    // ak subscrber kay bahut are differnt channel mil jayengy
        "channel",
        "fullName username avatar"
    );

    return res.status(200).json(
        new ApiResponse(200, channels, "Subscribed channels fetched successfully")
    );
})


export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
