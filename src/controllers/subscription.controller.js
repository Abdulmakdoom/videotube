import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.models.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

// step 1  ---- subscribtion method process
const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params   // user ID --- jsko follow krengy -- bo humay uskay page kay url sai milegi
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

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID");
    }

    // Find all channels the user has subscribed to
    const channels = await Subscription.find({ subscriber: subscriberId }).populate(
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
