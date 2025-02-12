import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    //const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    // ✅ Pagination: Fetches videos page-by-page based on page & limit.
    // ✅ Search (query): Case-insensitive search by title or description.
    // ✅ Sorting: Sorts by createdAt (default) but allows sorting by other fields.
    // ✅ User Filtering (userId): Retrieves only videos uploaded by a specific user.
    // ✅ Efficient Querying: Uses MongoDB operators $regex, $or, and countDocuments for optimization.

    // const { page = 0, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

    // const filter = {}; // Query filter object

    // // Search by title or description if 'query' is provided
    // if (query) {
    //     filter.$or = [
    //         { title: { $regex: query, $options: "i" } }, // Case-insensitive search
    //         { description: { $regex: query, $options: "i" } }
    //     ];
    // }

    // // Filter videos by userId (if provided)
    // if (userId) {
    //     filter.userId = userId;
    // }

    // // Convert page & limit to numbers
    // const pageNumber = parseInt(page, 10);
    // const limitNumber = parseInt(limit, 10);

    // // Sorting
    // const sortOption = {};
    // sortOption[sortBy] = sortType === "asc" ? 1 : -1; // Ascending or Descending

    // // Fetch videos with pagination
    // const videos = await Video.find(filter)
    //     .sort(sortOption)
    //     .skip((pageNumber - 1) * limitNumber)
    //     .limit(limitNumber);

    // // Get total count for pagination
    // const totalVideos = await Video.countDocuments(filter);

    // return res.status(200).json(new ApiResponse(200, {
    //     videos,
    //     totalPages: Math.ceil(totalVideos / limitNumber),
    //     currentPage: pageNumber,
    //     totalVideos
    // }, "Videos retrieved successfully"));


    let page = 0, limit = 10;

    let allVideos = await Video.find();

    if (!allVideos) {
        throw new ApiError(400, "Not founded all videos")
    }


    let descList = allVideos.reverse()

    let video;

    function val() {
        video=""
        let start = page * limit;
        let end = start + limit;
        
        let data = descList.slice(start, end); // Extract 10 items at a time
    
        console.log(data);
        video = data
    
        page++;  // Increase page number for next click
    }
    val()

    return res.status(201).json(
        new ApiResponse(200, video, "Videos get Successfully")
    )

    // const page = parseInt(req.query.page) || 1;
    // const limit = parseInt(req.query.limit) || 10;
    // const skip = (page - 1) * limit;
    // let allVideos = await Video.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

    
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description,} = req.body
    // TODO: get video, upload to cloudinary, create video

    if (   //validation - not empty
        [title, description].some((field) => field?.trim() === "")  // some work like map function working but return porblem 
    ) {
        throw new ApiError(400, "All fields are required")
    }

    let videoFileObj = req.files?.videoFile?.[0];
    // console.log(videoFileObj);
    // {
    //     fieldname: 'videoFile',
    //     originalname: '7955161-sd_226_426_25fps.mp4',
    //     encoding: '7bit',
    //     mimetype: 'video/mp4',
    //     destination: './public/temp',
    //     filename: '7955161-sd_226_426_25fps.mp4',
    //     path: 'public/temp/7955161-sd_226_426_25fps.mp4',
    //     size: 1502359
    //   }



    // Check if the uploaded file is a valid video format
    const allowedVideoTypes = ["video/mp4", "video/mkv", "video/webm", "video/avi"];
    if (!allowedVideoTypes.includes(videoFileObj.mimetype)) {
        throw new ApiError(400, "Invalid file type. Only video files are allowed.");
    }

    let videoFilePath = videoFileObj.path;
    let thumbnailPath = req.files?.thumbnail[0]?.path;

    //console.log(videoFilePath);  // public/temp/7955161-sd_226_426_25fps.mp4

    let videoFile = await uploadOnCloudinary(videoFilePath);
    let thumbnail = await uploadOnCloudinary(thumbnailPath);

    // {
    //     "url": "https://res.cloudinary.com/demo/video/upload/v1678901234/sample.mp4",
    //     "secure_url": "https://res.cloudinary.com/demo/video/upload/v1678901234/sample.mp4",
    //     "public_id": "some_public_id",
    //     "format": "mp4",
    //     "resource_type": "video",
    //     "created_at": "2025-02-12T12:34:56Z",
    //     "bytes": 1048576,
    //     "duration": 120.5,
    //     "width": 1280,
    //     "height": 720
    //   }
      


    if (!videoFile) {
        throw new ApiError(400, "Video file is required")
    }

    if (!thumbnailPath) {
        throw new ApiError(400, "Thumbnail is required")
    }

    // Convert created_at to a readable format (YYYY-MM-DD HH:mm:ss)
    const uploadedAt = new Date(videoFile.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }); // Convert to IST


    const videos = await Video.create({
        videoFile : videoFile.url,
        thumbnail: thumbnail.url,
        title: title,
        description: description,
        owner: req.user._id,
        createdAt: uploadedAt
    })

    return res.status(201).json(
        new ApiResponse(200, videos, "User upload videos Successfully")
    )

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    let videoById = await Video.findById(videoId)

    if(!videoById) {
        throw new ApiError(400, "video not founded")
    }

    return res.status(201).json(
        new ApiResponse(200, videoById, "User upload videos Successfully")
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
    let deleteVideo = await Video.findByIdAndDelete(videoId)

    if(!deleteVideo) {
        throw new ApiError(400, "video not deleted")
    }

    return res.status(201).json(
        new ApiResponse(200, deleteVideo, "User delete videos Successfully")
    )

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    // video agar publish hai toh unpublise krdo
    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    video.isPublished = !video.isPublished;
    await video.save();

    res.status(200).json(new ApiResponse(200, video, "Publish status updated"));

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
