import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist

    if(!name.trim())
        {
            throw new ApiError(400 , `Name cannot be empty`)
        }
    const create = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })

    if (!create) {
        throw new ApiError(500 , `Error while creating a playlist  `)
    }

    res.status(201).json(new ApiResponse(201, create, "Playlist created succesfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    let page = 1, limit = 10, sortBy = 'createdAt', sortOrder = -1

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, 'Invalid user ID');
    }
    //TODO: get user playlists
    // let getPlaylist = await Playlist.find({owner: userId})

    // let playlist = await Playlist.findById(playlistId)
    // .populate({ path: 'owner' })  // Populates the owner field (fetches all owner details)
    // .populate({ path: 'videos' }) // Populates the videos field (fetches all video details)
    // .populate({ path: 'videos.owner' }); // Populates the video owner's details

    // OR

    // let playlist = await Playlist.findById(playlistId)
    // .populate('owner', 'username avatar')  // Fetch owner details
    // .populate({
    //     path: 'videos',
    //     select: 'title description thumbnail'
    // });
    
    // OR

    const getPlaylist = await Playlist.aggregate([
        {
            $match: {
                owner : new mongoose.Types.ObjectId(userId),
                isPublished: true,
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
                pipeline: [
                    {
                       $lookup: {
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "owner"
                       }
                    },
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            description: 1,
                            thumbnail: 1,
                            owner: {
                                username: 1,
                                avatar: 1,
                            },
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                videosCount: { $size: '$videos' },
                // totalViews: { $sum: '$videos.views' },
            },
        },
        {
            $sort: { [sortBy]: sortOrder },
        },
        {
            $skip: (page - 1) * limit,
        },
        {
            $limit: parseInt(limit),
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                videosCount: 1,
                totalViews: 1,
                createdAt: 1,
                updatedAt: 1,
                owner: {
                    username: 1,
                    avatar: 1,
                },
                videos: 1,
            }
        }
    ])

    if (!getPlaylist) {
        throw new ApiError(404, 'Playlists not found');
    }

    return res.status(200).json(new ApiResponse(200, getPlaylist, 'Playlists fetched successfully'));

    
})

// [
//     {
//       "_id": "65b4c7d9e1a3f7b9c4d2e1a1",
//       "name": "My Favorite Videos",
//       "description": "A collection of my favorite videos",
//       "videosCount": 8,
//       "totalViews": 1530,
//       "createdAt": "2024-02-10T12:34:56.789Z",
//       "updatedAt": "2024-02-15T14:00:00.000Z",
//       "owner": {
//         "username": "JohnDoe",
//         "avatar": "https://example.com/avatar.jpg"
//       },
//       "videos": [
//         {
//           "_id": "65a8d3b7e9f1a3d7c9e4b8d3",
//           "title": "Introduction to MongoDB",
//           "description": "Learn MongoDB basics in this tutorial",
//           "thumbnail": "https://example.com/thumbnail1.jpg",
//           "owner": [
//             {
//               "username": "TechGuru",
//               "avatar": "https://example.com/user-avatar1.jpg"
//             }
//           ]
//         },
//         {
//           "_id": "65b4d3e9e1a7c2f9b5d8e1a6",
//           "title": "Advanced JavaScript",
//           "description": "Master JavaScript with this guide",
//           "thumbnail": "https://example.com/thumbnail2.jpg",
//           "owner": [
//             {
//               "username": "CodeMaster",
//               "avatar": "https://example.com/user-avatar2.jpg"
//             }
//           ]
//         }
//       ]
//     }
//   ]
  

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, 'Invalid playlist ID');
    }

    let playlist = await Playlist.findById(playlistId)
    .populate('owner', 'username avatar')  // Fetch owner details
    .populate({
        path: 'videos',
        // select: 'videoFile title description thumbnail duration views',
        populate: {
            path: 'owner',
            select: 'username avatar' 
        }
    })
    .lean()// Converts the result to a plain JS object    // Mongoose Methods not work problem only
    .exec(); // Executes the query and returns a promise

    if (!playlist) {
        throw new ApiError(404, 'Playlists not found');
    }

    playlist.videosCount = playlist.videos.length;
    playlist.totalViews = playlist.videos.reduce((acc, video) => acc + video.views, 0);

    return res.status(200).json(new ApiResponse(200, playlist, 'Playlists fetched successfully'));

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params;

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid playlist or video ID');
    }

    const playlist = await Playlist.findOne({ _id: playlistId, owner: req.user._id });
    if (!playlist) {
        throw new ApiError(403, 'You do not have permission to add videos to this playlist');
    }

    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, 'Video already exists in the playlist');
    }

    const addVideo = await Playlist.findByIdAndUpdate(playlistId, {
        $push: {videos: videoId}
    },
    {new : true}
    )

    if (!addVideo) {
        throw new ApiError(500, 'Error adding video to playlist');
    }

    res.status(201).json(new ApiResponse(201, addVideo, "Video added in playlist succesfully"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid playlist or video ID');
    }
    
   const playlist = await Playlist.findOne({_id: playlistId, owner: req.user._id});
   if (!playlist) {
    throw new ApiError(403, 'You do not have permission to remove videos from this playlist');
    }

    if(!playlist.videos.includes(videoId)) {
        throw new ApiError(400, 'Video not found in the playlist');
    }

    playlist.videos.pull(videoId);

    await playlist.save()

    return res.status(200).json(new ApiResponse(200, playlist, 'Video removed from playlist successfully'));
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
      
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(404, 'Invalid playlist id');
    }
    
    const playlist = await Playlist.findOne({ _id: playlistId, owner: req.user._id });
    if (!playlist) {
        throw new ApiError(403, 'You do not have permission to Delete  this playlist');
    }


    const playlistDelete = await Playlist.findByIdAndDelete(playlistId)
    if (!playlistDelete) {
        throw new ApiError(404, 'Playlist not found');
    }
    return res.status(200).json(new ApiResponse(200, null, 'Playlist deleted successfully'))    
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, 'Invalid playlist ID');
    }
    if (!name) {
        throw new ApiError(400, 'Name  are required');
    }
    if (name.length > 50 || description.length > 255) {
        throw new ApiError(400, 'Name and description length limits exceeded');
    }

    const playlist = await Playlist.findOne({ _id: playlistId, owner: req.user._id });
    if (!playlist) {
        throw new ApiError(403, 'You do not have permission to Delete  this playlist');
    }

    playlist.name = name;
    playlist.description = description;


    await playlist.save();

    return res.
    status(200)
    .json(new ApiResponse(200, playlist, 'Playlist updated successfully'));
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
