import React, { useEffect, useState } from 'react';
import {Spinner, Card, timeAgo, PlaylistCard, PostCard} from '../components/allComponents.js'
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import fetchWithAuth from '../utils/api.js';

function YourVideos () {
    const [videoData, setVideoData] = useState([])
    const [loading, setLoading] = useState(false);
    const [platlistData, setPlaylistData] = useState([])
    const [postData, setPostData] = useState([])

    const userData = useSelector((state) => state.auth.userData);
    const userId = userData?._id;
    let url = import.meta.env.VITE_API_URL

    //console.log(userId);


    const videoHandler = async () => {
        if (!userId) {
            // Prevent the fetch call if there is no valid ID
            return;
        }
    
        setVideoData([])
        setLoading(true); // Set loader to true before fetching
    
        try {
            let response = await fetchWithAuth(`${url}/api/v1/videos/u?page=1&limit=10&sortBy=createdAt&sortType=desc&userId=${userId}`, {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            let result = await response.json();
    
            //console.log(result);
            
            if (!response.ok) {
                throw new Error(result.message || "Failed to fetch videos");
            }
    
            setVideoData(result.data);
    
        } catch (error) {
            //console.log(error.message);
            // Optionally, set an error state here to show an error message to the user
            // setError(error.message); // example
        } finally {
            setLoading(false); // Always set loader to false, whether success or failure
        } 
    }

    const playListHandler = async () => {
        if (!userId) {
            // Prevent the fetch call if there is no valid ID
            return;
        }
    
        setPlaylistData([])
        setLoading(true); // Set loader to true before fetching
    
        try {
            let response = await fetchWithAuth(`${url}/api/v1/playlist/user/${userId}`, {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            let result = await response.json();
    
            // console.log(result);
            
            if (!response.ok) {
                throw new Error(result.message || "Failed to fetch videos");
            }
    
            setPlaylistData(result.data);
    
        } catch (error) {
            //console.log(error.message);
            // Optionally, set an error state here to show an error message to the user
            // setError(error.message); // example
        } finally {
            setLoading(false); // Always set loader to false, whether success or failure
        }
    }



    const postHandler = async () => {
        if (!userId) {
            // Prevent the fetch call if there is no valid ID
            return;
        }
    
        setPostData([])
        setLoading(true); // Set loader to true before fetching
    
        try {
            let response = await fetchWithAuth(`${url}/api/v1/tweets/user/${userId}`, {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            let result = await response.json();
    
            //console.log(result);
            
            if (!response.ok) {
                throw new Error(result.message || "Failed to fetch tweets");
            }
    
            setPostData(result.data);
    
        } catch (error) {
            //console.log(error.message);
            // Optionally, set an error state here to show an error message to the user
            // setError(error.message); // example
        } finally {
            setLoading(false); // Always set loader to false, whether success or failure
        }
    }

    useEffect(()=> {
        postHandler()
        videoHandler()
        playListHandler()
    }, [userId])




    //console.log(videoData);
return (
        <>
    <div className='pl-20'>

        {!userId && (
            <div className="flex flex-col items-center justify-center h-screen text-center px-4">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white mb-4">
                Please log in to view followed creators' videos, posts, and playlists
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                Sign in to access content from creators you follow — including their latest videos, shared posts, and personalized playlists.
                </p>
                <a
                href="/login"
                className="inline-block px-6 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-medium transition duration-200"
                >
                Go to Login
                </a>
            </div>
        )}

            {/* videos */}
       {userId && <div className="relative text-white mt-23 text-xl font-semibold bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="absolute inset-0 bg-black opacity-70 rounded-lg"></div>
            <div className='flex justify-between items-center'>
                <div className="relative z-10 text-lg">
                    <span className="font-bold">Videos</span>
                </div>
                <div className='text-gray-300 hover:text-red-400 text-sm cursor-pointer z-10'>
                    <Link to={`/videos/${userId}`} className="underline">
                        View More
                    </Link>
                </div>
            </div>
        </div>}




        <div className="flex flex-col mt-2">
                    {userId && videoData.length === 0 && <h2 className="text-sm md:text-md font-semibold text-gray-400 mb-4 p-4">
                    No videos available
                    </h2>  }   
            <div className="flex-grow p-4 flex flex-col items-center justify-start">
                
                {videoData.length != 0 && loading ? <div className="mt-60"><Spinner /> </div>: null}
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8"> 
                    {videoData.map((video, index) => (   // {videoData.slice(0, 6).map((video) => (
                         index < 6 && (
                            <Link to={`/home/videos/${video._id}`} key={video._id}>
                           <Card 
                                title={video.title}
                                duration={video.duration} 
                                thumbnail={video.thumbnail} 
                                ownerAvatar={video.ownerDetails.avatar} 
                                channelName={video.ownerDetails.username} 
                                views={video.views} 
                                uploadDate={timeAgo(video.createdAt)}
                            />
                        </Link>
                         )
                    ))}
                </div>
            </div>
        </div>
        {/* Tweets */}
      
        {userId && <div className="relative text-white mt-6 text-xl font-semibold bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="absolute inset-0 bg-black opacity-70 rounded-lg"></div>
            <div className='flex justify-between items-center'>
                <div className="relative z-10 text-lg">
                    <span className="font-bold">Tweets</span>
                </div>
                <div className='text-gray-300 hover:text-red-400 text-sm cursor-pointer z-10 underline'>
                    <Link to={`/posts/${userId}`}>
                         View More
                    </Link>
                </div>
            </div>
        </div>}

         {/* Post Content */}
         <div className="w-full">
                <div className="flex flex-col mt-4">
                    {/* Main content */}
                    <div className="flex-grow p-4 flex flex-col items-start justify-start">
                    
                    {/* Loader spinner when loading */}
                    {postData.length != 0 && loading ? (
                        <div className="flex justify-center items-center w-full mt-60">
                        <Spinner />
                        </div>
                    ) : null}

                    {userId && postData.length === 0 && <h2 className="text-sm md:text-md font-semibold text-gray-400 mb-4">
                    No posts available
                    </h2>  }

                    {/* Horizontal scrollable cards container */}
                    <div className="flex flex-row w-full space-x-4 overflow-x-auto scrollbar-hide">
                        {postData.slice(0, 4).map((post, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-[80%] sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
                        >
                            <PostCard
                            avatar={post?.owner?.avatar}
                            channelName={post?.owner?.username}
                            content={post?.content.slice(0, 200) + "..."}
                            uploadTime={timeAgo(post?.createdAt)}
                            postId={post?._id}
                            userId={post?.owner?._id}
                            />
                        </div>
                        ))}
                    </div>
                    </div>
                </div>
            </div>




        {/* playlists */}
       {userId && <div className="relative text-white mt-6 text-xl font-semibold bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="absolute inset-0 bg-black opacity-70 rounded-lg"></div>
            <div className='flex justify-between items-center'>
                <div className="relative z-10 text-lg">
                    <span className="font-bold">Playlists</span>
                </div>
                <div className='text-gray-300 hover:text-red-400 text-sm cursor-pointer z-10 underline'>
                    <Link to={`/videos/playlist/${userId}`}>
                         View More
                    </Link>
                </div>
            </div>
        </div>}


        <div className="flex flex-col">
            
            <div className="flex-grow p-4 flex flex-col justify-start">
                
            {platlistData.length != 0 && loading ? (
                    <div className="flex justify-center items-center mt-60">
                        <Spinner />
                    </div>
                    ) : null}

                   {userId && platlistData.length === 0 && <h2 className="text-sm md:text-md font-semibold text-gray-400 mb-4">
                    No playlists available
                    </h2>  }
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8"> 
                    {platlistData.map((video, index) => (
                        index < 6 && (<div key={index} className="w-full">
                            <Link to={`/playlist/${video?._id}`}>
                                <PlaylistCard
                                    thumbnail={video?.videos[0]?.thumbnail}
                                    videoCount={video?.videosCount}
                                    title={video?.name}
                                    updatedAt={timeAgo(video?.updatedAt)}
                                />
                            </Link>
                        </div>) 
                    ))}
                </div>
            </div> 
        </div>
    </div>

        </>
    )
}

export default YourVideos;