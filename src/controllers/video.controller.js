import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy = "createdAt", sortType = "desc", userId } = req.query;

    const sortOrder = sortType === "asc" ? 1 : -1;
    const skip = (page - 1) * limit; 

    let matchStage = {};
    if (userId) {
        matchStage.owner = new mongoose.Types.ObjectId(userId); 
    }

    try {
        const videos = await Video.aggregate([
            { $match: matchStage }, 
            { $sort: { [sortBy]: sortOrder } }, 
            { $skip: skip }, // Skip for pagination 
            { $limit: parseInt(limit) }, // Limit for pagination
            
            {
                $lookup: {
                    from: "users", // Referencing 'User' collection
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
                  "thumbnail":1,
                  "title":1,
                  "description":1,
                  "views":1,
                  "isPublished":1,
                  "owner":1,
                  "views":1,
                  "viewers": 1,
                  "createdAt":1,
                  "updatedAt":1,
                  "ownerDetails": {
                        "_id":1,
                        "username": 1,
                        "email": 1
                  }

                }
            }    
        ]);

        // Get total video count for pagination
        const totalVideos = await Video.countDocuments(matchStage);

        //console.log(videos);
        
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
    
})

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
    if (!isValidObjectId(videoId) || !isValidObjectId(req.user?._id)) {
      throw new ApiError(400, "Invalid videoId or userId");
    }

    let videoById = await Video.findById(videoId)

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


    if (videoId?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized to Update  this Comment");
    }

    let videoFileObj = req.files?.videoFile?.[0];

   


    // Check if the uploaded file is a valid video format
    const allowedVideoTypes = ["video/mp4", "video/mkv", "video/webm", "video/avi"];
    if (!allowedVideoTypes.includes(videoFileObj.mimetype)) {
        throw new ApiError(400, "Invalid file type. Only video files are allowed.");
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

    if (videoId?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized to Update  this Comment");
    }

    const video = await Video.findById(videoId);
  

    if (!video) {
      throw new ApiError(404, "Video not found");
    }
  
    if (video?.owner.toString() !== req.user?._id.toString()) {
      throw new ApiError(403, "Unauthorized to delete this video");
    }
    
    try {
        await Promise.all([
            Video.findByIdAndDelete(videoId),
        ]);

        res.status(200).json(new ApiResponse(200, {}, "Video deleted successfully"));
    } catch (error) {
      console.error('Error deleting video:', error);
      throw new ApiError(500, 'Failed to delete video');
    }

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    // video agar publish hai toh unpublise krdo

    if (videoId?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "Unauthorized to Update  this Comment");
    }

    const video = await Video.findById(videoId);
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

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    viwesUpdate
}
