import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy = "createdAt", sortType = "desc", userId } = req.query;

    // 1 method

    // // Validate userId
    // if (!userId) {
    //     throw new ApiError(400, "User ID is required");
    // }

    // // Convert page and limit to numbers
    // const pageNumber = parseInt(page, 10);
    // const limitNumber = parseInt(limit, 10);
    // const sortOrder = sortType === "asc" ? 1 : -1;

    // // Fetch videos with pagination and sorting
    // const allVideos = await Video.find({ owner: userId })
    //     .select("videoFile")
    //     .sort({ [sortBy]: sortOrder })
    //     .skip((pageNumber - 1) * limitNumber)
    //     .limit(limitNumber);

    // // If no videos found
    // if (!allVideos || allVideos.length === 0) {
    //     throw new ApiError(404, "No videos found for this user");
    // }

    // // Send response
    // res.status(200).json({
    //     success: true,
    //     page: pageNumber,
    //     limit: limitNumber,
    //     totalVideos: allVideos.length,
    //     videos: allVideos,
    // });


    
    // 2 method

    // get all vidoes based on the userid

    const sortOrder = sortType === "asc" ? 1 : -1;
    const skip = (page - 1) * limit; // If page = 2, skip = (2-1) * 10 = 10 (Skips the first 10 videos, starts from the 11th one).

    let matchStage = {};
    if (userId) {
        matchStage.owner = new mongoose.Types.ObjectId(userId); // Filter by user ID if provided
    }

    try {
        const videos = await Video.aggregate([
            { $match: matchStage }, // Apply filtering (if userId is provided)
            { $sort: { [sortBy]: sortOrder } }, // Sorting
            { $skip: skip }, // Skip for pagination  --- per page pr kitana item lana hai or kitana skip krna
            { $limit: parseInt(limit) }, // Limit for pagination
            {
                $lookup: {
                    from: "users", // Referencing 'User' collection
                    localField: "owner",
                    foreignField: "_id",
                    as: "ownerDetails"
                }
            },
            { $unwind: "$ownerDetails" },//populate // Flatten owner details // The MongoDB $unwind stage is used to break down an array field into individual documents. // The array ownerDetails will be "flattened," creating separate documents for each element in the array.
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

//console.log(videos);

// [
//     {
//         _id: new ObjectId('67addc03f6c15f1527a4995b'),
//         videoFile: 'http://res.cloudinary.com/dmlw1mz3w/video/upload/v1739447297/vsjgcfmd9sklyjvqxxtj.mp4',
//         thumbnail: 'http://res.cloudinary.com/dmlw1mz3w/image/upload/v1739447299/vd4b7whv1lxrmmjgqv4c.jpg',
//         title: 'superfrog',
//         description: 'the superfrog',
//         duration: 58,
//         views: 0,
//         isPublished: true,
//         owner: new ObjectId('67ac580572775ad277345c2b'),
//         createdAt: 2025-02-13T11:48:17.000Z,
//         updatedAt: 2025-02-13T11:48:17.000Z,
//         __v: 0,
//         ownerDetails: {
//             _id: new ObjectId('67ac580572775ad277345c2b'),
//             username: 'zaynzayn1',
//             email: 'zayn1@gmail.com',
//         }
//     }
// ]




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

    // // Convert created_at to a readable format (YYYY-MM-DD HH:mm:ss)
    // const uploadedAt = new Date(videoFile.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }); // Convert to IST
    // console.log(uploadedAt);

    // if (!uploadedAt) {
    //     throw new ApiError(400, "upload date not found")
    // }

    


    const videos = await Video.create({
        videoFile : videoFile.url,
        thumbnail: thumbnail.url,
        title: title,
        description: description,
        owner: req.user._id,
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
