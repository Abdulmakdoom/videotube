import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Subscription } from "../models/subscription.model.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const userId = req.user._id
    const {content} = req.body

    if (!content) {
        throw new ApiError(400, "Post content is required");
    }

    if(!userId) {
        throw new ApiError(404, "Post user not found")
    }
    const tweet = await Tweet.create({
        owner: userId,
        content: content,
    })

    if(!tweet) {
        throw new ApiError(404, "Tweet not created")
    }

    res.status(201).json(new ApiResponse(201, tweet, "Tweet created succesfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {ownerId} = req.params
   // console.log(ownerId);
    
    if (!isValidObjectId(ownerId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    let ownerTweets = await Tweet.find({owner: ownerId}).populate("owner").sort({ createdAt: -1 })

    res.status(201).json(new ApiResponse(201, ownerTweets, "Owner tweets get succesfully"))
})


const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params; 
    const { content } = req.body;
    const userId = req.user._id; // Extracted from verifyJWT // //const userId = req.user.id;  // extra check only login user can upadte the tweet


    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    // Find tweet and ensure ownership
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (tweet.owner.toString() !== userId) {
        throw new ApiError(403, "You are not authorized to update this tweet");
    }

    // Update and save tweet
    tweet.content = content;
    await tweet.save();


    

    res.status(200).json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});


const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const ownerId = req.user._id;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const tweet = await Tweet.findOneAndDelete({ _id: tweetId, owner: ownerId });

    if (!tweet) {
        throw new ApiError(404, "Tweet not found or unauthorized");
    }

    res.status(200).json(new ApiResponse(200, null, "Tweet deleted successfully"));
});


const getSubscribeTweets = asyncHandler(async (req, res) => {
    const userId = req?.user?._id;
    //console.log(userId);
    
        try {
        // Step 1: Find all subscriptions of the user
        const subscriptions = await Subscription.find({ subscriber: userId }).select("channel");        

        // Step 2: Extract channel (owner) IDs
        const channelIds = subscriptions.map(sub => sub.channel);

        // Step 3: Find videos owned by those channels
        const Posts = await Tweet.find({ owner: { $in: channelIds } }).populate("owner", "username fullName avatar");

        res.status(201).json(new ApiResponse(201, Posts, "Tweet get succesfully"))
    } catch (error) {
        console.error("Error fetching subscribed channel posts:", error);
        throw error;
    }
});

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
    getSubscribeTweets
}
