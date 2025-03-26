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
}) {
    
  // Format upload time
  const formattedTime = timeAgo(uploadTime);

  // Truncate the description (only show first 100 characters)
  const truncatedDescription =
    description?.length > 100 ? description.substring(0, 200) + "..." : description;

  

  return (
    // <div className="flex sm:flex-row sm:space-x-4 sm:ml-60">
    //     <div className="relative rounded-lg sm:w-60 sm:h-40 shadow-lg sm:ml-50 ml-50 sm:mb-0 sm:mt-4 bg-[#0A0A0A]">
    //         {/* Thumbnail */}
    //         <div className="relative" > {/* 16:9 Aspect Ratio */}
    //             <img
    //                 src={thumbnail}
    //                 alt={title}
    //                 className="absolute sm:top-0 sm:left-0 sm:w-full sm:h-40 object-contain rounded-md border-none" // Image fits within the 16:9 aspect ratio
    //             />
    //         </div>

    //         {/* Video Duration - Positioned at bottom-left corner */}
    //         <div className="absolute bottom-2 right-2 text-xs text-white bg-black bg-opacity-60 p-1 rounded-md">
    //             {duration}
    //         </div>
    //     </div>

    //     <div className="">
    //         <div className="relative flex border rounded-lg shadow-lg h-40 w-200 p-4 mb-4 mt-4 bg-[#0A0A0A]  transition-all">
    //             {/* Content */}
    //             <div className="flex flex-col justify-between">
    //             {/* Title */}
    //             <h3 className="text-lg font-semibold text-white">{title}</h3>

    //             {/* Channel Info */}
    //             <div className="flex items-center space-x-2">
    //                 {/* Channel Avatar */}
    //                 {avatar && (
    //                 <img
    //                     src={avatar}
    //                     alt={channelName}
    //                     className="w-8 h-8 object-cover rounded-full"
    //                 />
    //                 )}
    //                 <p className="text-sm text-gray-400">{channelName}</p>
    //             </div>

    //             {/* Description (truncated) */}
    //             <p className="text-xs text-gray-400 mt-2">{truncatedDescription}</p>

    //             {/* Stats */}
    //             <div className="flex items-center space-x-4 text-xs text-gray-400 mt-2">
    //                 <p> {views} views</p>
    //                 <p>{formattedTime}</p>
    //             </div>

    //             {/* User Channel ID
    //             {userChannelId && (
    //                 <p className="text-xs text-gray-400 mt-2">Channel ID: {userChannelId}</p>
    //             )} */}
    //             </div>

                
    //         </div>
    //     </div>
    // </div>


        <>
            <div className="flex flex-col sm:flex-row sm:space-x-4 sm:ml-16 sm:mr-16 md:ml-50 md:mr-32">

            {/* Thumbnail Section */}
            <div className="relative rounded-lg w-full sm:w-60 h-40 shadow-lg mb-4 sm:mb-0 sm:mt-0 bg-[#0A0A0A]">
                {/* Thumbnail */}
                <div className="relative w-full h-full">
                    <img
                        src={thumbnail}
                        alt={title}
                        className="absolute top-0 left-0 w-full h-full object-cover rounded-md border-none" // Use object-cover to fill the div
                    />
                </div>

                {/* Video Duration - Positioned at bottom-right corner */}
                <div className="absolute bottom-2 right-2 text-xs text-white bg-black bg-opacity-60 p-1 rounded-md">
                    {duration}
                </div>
            </div>

            {/* Content Section */}
            <div className="w-full sm:w-[calc(100%-16rem)]"> {/* Full width on small screens, adjusted on larger screens */}
                <div className="relative flex flex-col sm:flex-row border rounded-lg shadow-lg h-40 sm:h-40  mb-4 mt-0 sm:mt-0 bg-[#0A0A0A] transition-all ">
                {/* Content */}
                <div className="flex flex-col justify-between w-full sm:w-auto">
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-white">{title}</h3>

                    {/* Channel Info */}
                    <div className="flex items-center space-x-2">
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
                    <p className="text-xs text-gray-400 mt-2 sm:text-xs">{truncatedDescription}</p>

                    {/* Stats */}
                    <div className="flex items-center space-x-4 text-xs text-gray-400 mt-2">
                    <p>{views} views</p>
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


