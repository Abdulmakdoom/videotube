import React, {useState, useEffect} from "react";
import {Spinner, Card, timeAgo, Button} from '../components/allComponents.js'
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import fetchWithAuth from "../utils/api.js";


// Utility function to format the like count
const formatNumber = (number) => {
    if (number >= 1_000_000) {
      return (number / 1_000_000).toFixed(1) + 'M'; // Format as millions
    } else if (number >= 1_000) {
      return (number / 1_000).toFixed(1) + 'K'; // Format as thousands
    }
    return number; // Return the number as is if less than 1000
  };

function OwnerAllVideos() {
    const [videosData, setVideosData] = useState([])
     const [loading, setLoading] = useState(true);
     const [page, setPage] = useState(1)
     const [VideoData2, setVideoData2] = useState([])

    const userData = useSelector((state) => state.auth.userData);
    const userId1 = userData?._id;

    const {userId} = useParams()
    
    const pageIncreaseHandler = ()=> {
        page !== VideoData2.pagination.totalPages? setPage(page + 1): page 
    }

    const pageDecreaseHandler = ()=> {
       page >= 2? setPage(page - 1) : 1;
    }
    let url = import.meta.env.VITE_API_URL

    //console.log(VideoData2);
    

    const videoHandler = async () => {
        if (!userId1) {
            // Prevent the fetch call if there is no valid ID
            return;
        }
    
        setVideosData([])
        setLoading(true); // Set loader to true before fetching
    
        try {
            let response = await fetchWithAuth(`${url}/api/v1/videos/u?page=${page}&limit=10&sortBy=createdAt&sortType=desc&userId=${userId}`, {
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
    
            setVideoData2(result)
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
    }, [userId1, page])


    

    
    return (
        <>
        <div className="flex flex-col min-h-screen pl-20 mt-23">
            {/* Header */}
            <div className="relative z-10 mb-3 pl-5">
                <h2 className="font-bold text-3xl text-white">Your Videos</h2>
            </div>

            {/* Main Content */}
            <div className="flex-grow p-4 flex flex-col items-center justify-start">
                {loading ? <div className="mt-60"><Spinner /></div> : null}

                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    {videosData.map((video) => (
                        <Link to={`/home/videos/${video._id}`} key={video._id}>
                            <Card 
                                title={video.title}
                                duration={video.duration}
                                thumbnail={video.thumbnail}
                                ownerAvatar={video.ownerDetails.avatar}
                                channelName={video.ownerDetails.username}
                                views={formatNumber(video.views)}
                                uploadDate={timeAgo(video.createdAt)}
                            />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Sticky Footer Buttons */}
            <div className="sticky bottom-0 bg-black py-4 w-full flex justify-between lg:justify-evenly md:justify-evenly sm:justify-evenly items-center px-4 border-t border-gray-700">
                {/* Next Button */}
                <button
                    onClick={pageIncreaseHandler}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                >
                    Next
                </button>

                <div className="text-white text-xl font-medium px-6 py-3 rounded-lg backdrop-blur-md bg-white/10 border border-white/20 shadow-lg ring-1 ring-white/10 hover:ring-2 hover:ring-white/30 transition">
                    {VideoData2?.pagination?.currentPage} / {VideoData2?.pagination?.totalPages}
                </div>

                {/* Back Button */}
                <button
                    onClick={pageDecreaseHandler}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg shadow-md hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ml-4"
                >
                    Back
                </button>
            </div>
        </div>



        </>
    )
}

export default OwnerAllVideos;