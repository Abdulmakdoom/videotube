import React, { useEffect, useState } from 'react';
import {Spinner, Card, timeAgo, PlaylistCard} from '../components/allComponents.js'
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';



function YourVideos () {
    const [videoData, setVideoData] = useState([])
    const [loading, setLoading] = useState(true);
    const [platlistData, setPlaylistData] = useState([])

    const userData = useSelector((state) => state.auth.userData);
    const userId = userData?._id;

    //console.log(userId);
    

    const videoHandler = async () => {
        if (!userId) {
            // Prevent the fetch call if there is no valid ID
            return;
        }
    
        setVideoData([])
        setLoading(true); // Set loader to true before fetching
    
        try {
            let response = await fetch(`/api/v1/videos/u?page=1&limit=10&sortBy=views&sortType=desc&userId=${userId}`);
            let result = await response.json();
    
            //console.log(result);
            
            if (!response.ok) {
                throw new Error(result.message || "Failed to fetch videos");
            }
    
            setVideoData(result.data);
    
        } catch (error) {
            console.log(error.message);
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
            let response = await fetch(`/api/v1/playlist/user/${userId}`);
            let result = await response.json();
    
            // console.log(result);
            
            if (!response.ok) {
                throw new Error(result.message || "Failed to fetch videos");
            }
    
            setPlaylistData(result.data);
    
        } catch (error) {
            console.log(error.message);
            // Optionally, set an error state here to show an error message to the user
            // setError(error.message); // example
        } finally {
            setLoading(false); // Always set loader to false, whether success or failure
        }
    }
    useEffect(()=> {
        videoHandler()
        playListHandler()
    }, [userId])

    //console.log(videoData);
return (
        <>
        {/* videos */}
        <div className="relative text-white mt-23 text-xl font-semibold bg-gray-800 p-4 rounded-lg shadow-lg">
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
        </div>




        <div className="flex flex-col mt-2">
        
            <div className="flex-grow p-4 flex flex-col items-center justify-start">
                
                {loading ? <div className="mt-60"><Spinner /> </div>: null}
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8"> 
                    {videoData.map((video, index) => (
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
        <div className="relative text-white mt-6 text-xl font-semibold bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="absolute inset-0 bg-black opacity-70 rounded-lg"></div>
            <div className='flex justify-between items-center'>
                <div className="relative z-10 text-lg">
                    <span className="font-bold">Tweets</span>
                </div>
                <div className='text-gray-300 hover:text-red-400 text-sm cursor-pointer z-10 underline'>
                    View More
                </div>
            </div>
        </div>


        {/* playlists */}
        <div className="relative text-white mt-6 text-xl font-semibold bg-gray-800 p-4 rounded-lg shadow-lg">
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
        </div>


        <div className="flex flex-col">
            
            <div className="flex-grow p-4 flex flex-col justify-start">
                
            {loading ? (
                    <div className="flex justify-center items-center mt-60">
                        <Spinner />
                    </div>
                    ) : null}
                
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

        </>
    )
}

export default YourVideos;