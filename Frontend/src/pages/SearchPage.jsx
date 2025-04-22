import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Spinner from "../components/Loader";
import timeAgo from "../components/time";
import fetchWithAuth from "../utils/api";


function formatDuration(seconds) {
    // Ensure we are working with an integer value by truncating the float
    const totalSeconds = Math.floor(seconds);

    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    // Format as "HH:MM:SS" if there's an hour part
    const parts = [];
    if (hrs > 0) parts.push(hrs.toString().padStart(2, '0'));
    parts.push(mins.toString().padStart(2, '0'));
    parts.push(secs.toString().padStart(2, '0'));

    return parts.join(':');
}

// Utility function to format the like count
const formatNumber = (number) => {
    if (number >= 1_000_000) {
      return (number / 1_000_000).toFixed(1) + 'M'; // Format as millions
    } else if (number >= 1_000) {
      return (number / 1_000).toFixed(1) + 'K'; // Format as thousands
    }
    return number; // Return the number as is if less than 1000
  };

function SearchPage (){
    const {topic} = useParams()   
    const [searchData, setSearchData] = useState([])
    const [loading, setLoading] = useState(false); 

    let url = import.meta.env.VITE_API_URL
    
    useEffect(()=>{
      const searchVideosData = async()=> {
        setSearchData([])

        if(topic != ""){
            setLoading(true)
            try {
                const response = await fetchWithAuth(`${url}/api/v1/videos/u/videos`, {
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            const result = await response.json()
            //console.log(result.data);
            const videosArray = result.data
        
            const searchVideos = videosArray.filter(video => video.description.includes(topic)) 
            //console.log(searchVideos);
            if(!response.ok){
                setLoading(true)
                
            }
            setLoading(false)   
            setSearchData(searchVideos)      
                
            } catch (error) {
                
            }  
         }
        
      }
      searchVideosData()
    }, [topic])  
    
    //console.log(searchData);
    

    return (
        <>

      {loading ? (
                <div className="flex justify-center items-center mt-60">
                    <Spinner />
                </div>
            ) : null}
        
            <div className="mt-20 pl-20">
                {searchData.map((data) => (
                <Link to={`/home/videos/${data._id}`} key={data._id}>
                    <div
                    key={data._id}
                    className="w-full flex gap-8 py-6 px-4 sm:px-6 border-b border-gray-700 hover:bg-[#272727] transition duration-200"
                    >
                    {/* Thumbnail - larger and more proportionate */}
                    <div className="relative w-[45%] max-w-[450px] aspect-video rounded-xl overflow-hidden flex-shrink-0">
                        <img
                        src={data.thumbnail}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                        {formatDuration(data.duration)}
                        </span>
                    </div>

                    {/* Right Content */}
                    <div className="flex flex-col flex-1 overflow-hidden text-white">
                        {/* Title */}
                        <h3 className="text-xl md:text-2xl font-semibold leading-snug line-clamp-2">
                        {data.title}
                        </h3>

                        {/* Channel Row */}
                        <div className="flex items-center gap-3 mt-3 text-sm text-gray-400">
                        <img
                            src={data.owner.avatar}
                            alt="Channel avatar"
                            className="w-8 h-8 rounded-full"
                        />
                        <span className="hover:underline truncate">{data.owner.username}</span>
                        </div>

                        {/* Meta Info */}
                        <div className="text-sm text-gray-400 mt-1">
                        {formatNumber(data.views)} views • {timeAgo(data.createdAt)}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-400 mt-3 line-clamp-2 hidden sm:block">
                        {data.description}
                        </p>
                    </div>
                    </div>
                </Link>
                ))}
            </div>

        </>
    )
}

export default SearchPage;