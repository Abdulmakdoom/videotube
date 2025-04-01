import React, {useState, useEffect} from "react";
import {Spinner, Card, timeAgo} from '../components/allComponents.js'
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";


function OwnerAllVideos() {
    const [videosData, setVideosData] = useState([])
     const [loading, setLoading] = useState(true);

    const userData = useSelector((state) => state.auth.userData);
    const userId = userData?._id;


    const videoHandler = async () => {
        if (!userId) {
            // Prevent the fetch call if there is no valid ID
            return;
        }
    
        setVideosData([])
        setLoading(true); // Set loader to true before fetching
    
        try {
            let response = await fetch(`/api/v1/videos/u?page=1&limit=10&sortBy=views&sortType=desc&userId=${userId}`);
            let result = await response.json();
    
            console.log(result);
            
            if (!response.ok) {
                throw new Error(result.message || "Failed to fetch videos");
            }
    
            setVideosData(result.data);
    
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
    }, [userId])
    return (
        <>

        <div className="flex flex-col mt-23">
        
            <div className="relative z-10 mb-6 pl-5">
                <h2 className="font-bold text-3xl text-white">Your Videos</h2>
            </div>
            
            <div className="flex-grow p-4 flex flex-col items-center justify-start">
                
                {loading ? <div className="mt-60"><Spinner /> </div>: null}

                
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8"> 
                    {videosData.map((video, index) => (
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
                    ))}
                </div>
            </div>
        </div>
        </>
    )
}

export default OwnerAllVideos;