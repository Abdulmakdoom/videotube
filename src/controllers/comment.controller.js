import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const skip = (page - 1) * limit; // If page = 2, skip = (2-1) * 10 = 10 (Skips the first 10 videos, starts from the 11th one).

    let matchStage = {};
        if (videoId) {
            matchStage.video = new mongoose.Types.ObjectId(videoId); // Filter by user ID if provided
        }

    const comments = await Comment.aggregate([
        {
            $match: matchStage
        },
        { $skip: skip },
        { $limit: parseInt(limit) },
        {
            $sort: { createdAt: -1 } // Latest comments first
        },

        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as : "ownerDetails"
                
            }
        },
        {
            $unwind: "$ownerDetails" // Convert array to object
        },
        {
            $project: {
                _id: 1,
                content: 1,
                createdAt: 1,
                updatedAt: 1,
                video:1,
                ownerDetails: {
                    _id:1,
                    username:1,
                    fullName:1,
                    avatar:1
                }
            }
        }
    ]);

    // Get total video count for pagination
    const totalVideos = await Comment.countDocuments(matchStage);

    res.status(201).json(new ApiResponse(201, comments, "Get comment successfully"));

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a 
    const {videoId} = req.params
    const {content} = req.body;
    const userId = req.user._id; // Assuming authentication middleware attaches user info

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    if (!content) {
        throw new ApiError(400, "Comment content is required");
    }

    // Create the comment
    const newComment = await Comment.create({
        content,
        video: videoId,
        owner: userId
    });

    res.status(201).json(new ApiResponse(201, newComment, "Comment added successfully"));
})


const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {content} = req.body;
    const userId = req.user._id



    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    if (!content) {
        throw new ApiError(400, "Comment content is required");
    }



    const updateComment = await Comment.findOne({ _id: commentId, owner: userId });

    if (!updateComment) {
        throw new ApiError(404, "Tweet not found or unauthorized");
    }

    updateComment.content = content;
    await updateComment.save();


    if (!updateComment) {
        throw new ApiError(404, "Comment not found");
    }


    res.status(201).json(new ApiResponse(201, updateComment, "Comment updated successfully"));

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params;
    const userId = req.user._id

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const deleteComment = await Comment.findOneAndDelete({ _id: commentId, owner: userId });

    if (!deleteComment) {
        throw new ApiError(404, "Comment not found or unautharized resquest");
    }

    res.status(201).json(new ApiResponse(201, null, "Comment delete successfully"));
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
