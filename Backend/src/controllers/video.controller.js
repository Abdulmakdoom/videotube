import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { v2 as cloudinary } from 'cloudinary';
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"



const getVideos = asyncHandler(async(req, res)=> {
    const {sortBy = "createdAt", sortType = "desc"} = req.query;
    const {userId} = req.params;

    // try {
    //     // Step 1: Find all subscriptions of the user
    //     const subscriptions = await Subscription.find({ subscriber: userId }).select("channel");

    //     // Step 2: Extract channel (owner) IDs
    //     const channelIds = subscriptions.map(sub => sub.channel);

    //     // Step 3: Find videos owned by those channels
    //     const videos = await Video.find({ owner: { $in: channelIds } }).populate("owner", "username fullName avatar");

    //     return videos;
    // } catch (error) {
    //     console.error("Error fetching subscribed channel videos:", error);
    //     throw error;
    // }

    const sortOrder = sortType === "asc" ? 1 : -1;

    let matchStage = {};
    if (userId) {
        matchStage.subscriber = new mongoose.Types.ObjectId(userId); 
    }

    try {
        const videos = await Subscription.aggregate([
            { $match: matchStage }, 
            { $sort: { [sortBy]: sortOrder } }, 

            {
                $lookup: {
                    from: "videos",         // Collection to join (case-sensitive)
                    localField: "channel",  // Field in Subscription model
                    foreignField: "owner",  // Field in Video model
                    as: "channelVideos"     // Output array field
                }
            },
            {
                $unwind: "$channelVideos" // Flatten the channelVideos array
            },
            {
                $replaceRoot: { newRoot: "$channelVideos" } // Replace root with video data
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "ownerDetails"
                }
            },
            {
                $unwind: "$ownerDetails"
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    videoFile: 1,
                    thumbnail: 1,
                    duration: 1,
                    views: 1,
                    isPublished: 1,
                    createdAt: 1,
                    owner: {
                        _id: "$ownerDetails._id",
                        username: "$ownerDetails.username",
                        fullName: "$ownerDetails.fullName",
                        avatar: "$ownerDetails.avatar"
                    }
                }
            }
        ]);

        const totalVideos = await Subscription.countDocuments(matchStage);

        res.status(200).json({
            success: true,
            message: "Videos fetched successfully",
            data: videos,
            pagination: {
                totalVideos,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }    
})

const getAllUserVideos = asyncHandler(async (req,res)=> {
        try {
            // Fetch all videos from the database
            let allVideos = await Video.find().populate("owner", "username fullName avatar"); // Assuming you're using Mongoose
    
            // Check if no videos are found
            if (!allVideos) {
                return res.status(404).json({ message: "No videos found." });
            }
    
            // Return the videos in the response
            res.status(200).json({ data: allVideos });
        } catch (err) {
            console.error("Error fetching videos:", err);
            res.status(500).json({ message: "Something went wrong while fetching videos." });
        } 
})

const getAllVideos = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortType = "desc",
        userId,
    } = req.query;

    const sortField = sortBy || "createdAt";
    const sortOrder = sortType === "asc" ? 1 : -1;
    const skip = (parseInt(page) - 1) * parseInt(limit); 

    let matchStage = {};
    if (userId) {
        matchStage.owner = new mongoose.Types.ObjectId(userId); 
    }

    try {
        const videos = await Video.aggregate([
            { $match: matchStage }, 
            { $sort: { [sortField]: sortOrder } }, 
            { $skip: skip }, 
            { $limit: parseInt(limit) },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "ownerDetails"
                }
            },
            { $unwind: "$ownerDetails" },
            { 
                $project: { 
                    "_id": 1, 
                    "videoFile": 1,
                    "duration": 1,
                    "thumbnail":1,
                    "title":1,
                    "description":1,
                    "views":1,
                    "isPublished":1,
                    "owner":1,
                    "viewers": 1,
                    "createdAt":1,
                    "updatedAt":1,
                    "ownerDetails": {
                        "_id":1,
                        "username": 1,
                        "email": 1,
                        "avatar": 1
                    }
                }
            }    
        ]);

        const totalVideos = await Video.countDocuments(matchStage);

        res.status(200).json({
            success: true,
            message: "Videos fetched successfully",
            data: videos,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalVideos / limit),
                totalVideos,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description,} = req.body
    // TODO: get video, upload to cloudinary, create video


    if (   //validation - not empty
        [title, description].some((field) => field?.trim() === "")  
    ) {
        throw new ApiError(400, "All fields are required")
    }

    let videoFileObj = req.files?.videoFile?.[0];



    // Check if the uploaded file is a valid video format
    const allowedVideoTypes = ["video/mp4", "video/mkv", "video/webm", "video/avi"];
    if (!allowedVideoTypes.includes(videoFileObj.mimetype)) {
        throw new ApiError(400, "Invalid file type. Only video files are allowed.");
    }

    let videoFilePath = videoFileObj.path;
    let thumbnailPath = req.files?.thumbnail[0]?.path;

    

    let videoFile = await uploadOnCloudinary(videoFilePath);
    let thumbnail = await uploadOnCloudinary(thumbnailPath);

      


    if (!videoFile) {
        throw new ApiError(400, "Video file is required")
    }

    if (!thumbnailPath) {
        throw new ApiError(400, "Thumbnail is required")
    }


    const videos = await Video.create({
        videoFile : videoFile.url,
        thumbnail: thumbnail.url,
        title: title,
        description: description,
        owner: req.user?._id,
        createdAt: videoFile.created_at,
        isPublished: true,
        duration: videoFile.duration
    })

    return res.status(201).json(
        new ApiResponse(200, videos, "User upload videos Successfully")
    )

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    //TODO: get video by id
    // Validate input
    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid videoId or userId");
    }


    let videoById = await Video.findById(videoId).populate("owner", "username fullName avatar")
    
    if(!videoById) {
        throw new ApiError(400, "video not founded")
    }

    return res.status(201).json(
        new ApiResponse(200, videoById, "User get videos Successfully")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description,} = req.body

    let videoFileObj = req.files?.videoFile?.[0];

    // Check if the uploaded file is a valid video format
    const allowedVideoTypes = ["video/mp4", "video/mkv", "video/webm", "video/avi"];
    if (!allowedVideoTypes.includes(videoFileObj.mimetype)) {
        throw new ApiError(400, "Invalid file type. Only video files are allowed.");
    }

    const video = await Video.findById(videoId);

    if (video?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized to Update  this Comment");
    }

    const getPublicId = (url) => url.split('/').pop().split('.')[0];
        
         // Delete the video file from Cloudinary
         if (video.videoFile) {
             await cloudinary.uploader.destroy(getPublicId(video.videoFile), { resource_type: "video" });
         }
 
         // Delete the thumbnail from Cloudinary
         if (video.thumbnail) {
             await cloudinary.uploader.destroy(getPublicId(video.thumbnail), { resource_type: "image" });
         } 
         
         

    let videoFilePath = videoFileObj.path;
    let thumbnailPath = req.files?.thumbnail[0]?.path;

    let updateVideoFile = await uploadOnCloudinary(videoFilePath);
    let updateThumbnail = await uploadOnCloudinary(thumbnailPath);

     // Convert created_at to a readable format (YYYY-MM-DD HH:mm:ss)
     const updatedAt = new Date(updateVideoFile.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }); // Convert to IST
    //TODO: update video details like title, description, thumbnail
    let videoUpdate = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description,
                videoFile: updateVideoFile.url,
                thumbnail: updateThumbnail.url,
                updatedAt: updatedAt
            }
        },
        {new: true}
    )

    if(!videoUpdate) {
        throw new ApiError(400, "video not updated")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, videoUpdate, "Video updated successfully")
    )


})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    const video = await Video.findById(videoId);
  

    if (!video) {
      throw new ApiError(404, "Video not found");
    }
  
    if (video?.owner.toString() !== req.user?._id.toString()) {
      throw new ApiError(403, "Unauthorized to delete this video");
    }

    try {
        // Extract Cloudinary public IDs from URLs
        const getPublicId = (url) => url.split('/').pop().split('.')[0];

        //console.log(video.videoFile); // http://res.cloudinary.com/dmlw1mz3w/video/upload/v1740648354/pfndmsvivkbdznwxxgnc.mp4
         
        //console.log(getPublicId(video.videoFile));   // pfndmsvivkbdznwxxgnc
        
         // Delete the video file from Cloudinary
         if (video.videoFile) {
             await cloudinary.uploader.destroy(getPublicId(video.videoFile), { resource_type: "video" });
         }
 
         // Delete the thumbnail from Cloudinary
         if (video.thumbnail) {
             await cloudinary.uploader.destroy(getPublicId(video.thumbnail), { resource_type: "image" });
         }              

        // Delete the video document from the database
        await Video.findByIdAndDelete(videoId);


    // try {
    //     await Promise.all([
    //         Video.findByIdAndDelete(videoId),
    //     ]);

        res.status(200).json(new ApiResponse(200, {}, "Video deleted successfully"));
    } catch (error) {
      console.error('Error deleting video:', error);
      throw new ApiError(500, 'Failed to delete video');
    }

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    // video agar publish hai toh unpublise krdo


    const video = await Video.findById(videoId);


    if (video?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized to Update  this Comment");
    }

    if (!video) throw new ApiError(404, "Video not found");

    video.isPublished = !video.isPublished;
    await video.save();

    res.status(200).json(new ApiResponse(200, video, "Publish status updated"));

})


const viwesUpdate = asyncHandler(async (req, res)=> {
    let {videoId} = req.params;
    let user = req.user?._id

    const watchHistry = await User.findByIdAndUpdate(
        user,
        {
            $push: {watchHistory : videoId}
        },
        {new: true}
    )
   
    const video = await Video.findOne({_id: videoId});
    // console.log(video);
    

    if (!video) throw new ApiError(404, "Video not found");

    // Check if the user has already viewed the video
    const hasViewed = video.viewers.some(viewer => viewer.userId.toString() === user.toString());  

    

    if (!hasViewed) {
        const increaseViews = await Video.findByIdAndUpdate(
            videoId,
            {
                $inc: {views: 1},
                $push: { viewers: { userId : user, timestamp: new Date() } }
            },
            { new: true }
        )
        return res.status(200).json(new ApiResponse(200, {increaseViews, watchHistry}, "Views status updated"));
    } else {
        return res.status(200).json(new ApiResponse(200, null, "User allready viewd"));
    }
    
})

const totalViews = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json(new ApiResponse(400, null, "User ID is required"));
    }

    try {
        const views = await Video.find({owner : userId,  views : 1}).select("views");
        //console.log(views);
        
        const countDocuments = await Video.countDocuments({ owner: userId, views: 1 })
        //console.log(countDocuments);

        // console.log(views.length);
        
        

        if (!views || views.length === 0) {
            throw new ApiError(404, "Views not found for this user");
        }

        return res.status(200).json(new ApiResponse(200, {views, countDocuments}, "Views fetched successfully"));
    } catch (error) {
        return res.status(error.status || 500).json(new ApiResponse(error.status || 500, null, error.message));
    }
});


export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    viwesUpdate,
    getVideos,
    getAllUserVideos,
    totalViews,
}
