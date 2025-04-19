import React from "react";
import { timeAgo } from "../components/allComponents.js";

function SmallCard({
  thumbnail,
  title,
  avatar,
  description,
  channelName,
  userChannelId,
  views,
  uploadTime,
  duration,
  className = "", 
  ...props
}) {


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
    
  // Format upload time
  const formattedTime = timeAgo(uploadTime);

  // Utility function to format the like count
const formatNumber = (number) => {
    if (number >= 1_000_000) {
      return (number / 1_000_000).toFixed(1) + 'M'; // Format as millions
    } else if (number >= 1_000) {
      return (number / 1_000).toFixed(1) + 'K'; // Format as thousands
    }
    return number; // Return the number as is if less than 1000
  };

  // Truncate the description (only show first 100 characters)
  const truncatedDescription =
    description?.length > 100 ? description.substring(0, 200) + "..." : description;

  

  return (

        <>
            <div className={`flex flex-col sm:flex-row sm:space-x-4 sm:ml-16 sm:mr-16 md:ml-50 md:mr-32 ${className}`} {...props}>

            {/* Thumbnail Section */}
            <div className="relative rounded-lg w-full sm:w-60 h-40 shadow-lg mb-4 sm:mb-0 sm:mt-0 bg-[#0A0A0A]">
                {/* Thumbnail */}
                <div className="relative aspect-video">
                    <img
                        src={thumbnail}
                        alt={title}
                        className="w-full h-full object-cover rounded-xl shadow-2xl transition-transform transform hover:scale-105 hover:shadow-2xl" // Use object-cover to fill the div
                    />
                </div>

                {/* Video Duration - Positioned at bottom-right corner */}
                <div className="absolute bottom-8 right-2 text-xs text-white bg-black bg-opacity-60 p-1 rounded-md">
                    {formatDuration(duration)}
                </div>
            </div>

            {/* Content Section */}
            <div className="w-full sm:w-[calc(100%-16rem)]"> {/* Full width on small screens, adjusted on larger screens */}
                <div className="relative flex flex-col sm:flex-row rounded-lg shadow-lg h-40 sm:h-40  mb-4 mt-0 sm:mt-0 bg-[#0A0A0A] transition-all ">
                {/* Content */}
                <div className="flex flex-col justify-between w-full sm:w-auto">
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-white">{title}</h3>

                    {/* Channel Info */}
                    <div className="flex items-center space-x-2 mt-2">
                    {/* Channel Avatar */}
                    {avatar && (
                        <img
                        src={avatar}
                        alt={channelName}
                        className="w-8 h-8 object-cover rounded-full"
                        />
                    )}
                    <p className="text-sm text-gray-400">{channelName}</p>
                    </div>

                    {/* Description (truncated) */}
                    <p className={`text-xs text-gray-400 mt-2 sm:text-xs ${className}`}>{truncatedDescription}</p>

                    {/* Stats */}
                    <div className={`flex items-center space-x-4 text-xs text-gray-400 ${className = "mb-20"}`}>
                    <p>{formatNumber(views)} views</p>
                    <p>{formattedTime}</p>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </>
  );
}

export default SmallCard;


