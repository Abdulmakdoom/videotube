import React from "react";


function Card({title, duration, thumbnail, ownerAvatar, channelName, views, uploadDate, className = "", ...props }) {

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
    

   
    return (
        <div className={`bg-[#0A0A0A] shadow-lg rounded-lg overflow-hidden ${className}`} {...props}>
            <div className="relative aspect-video">
                <img src={thumbnail} alt={title} className="w-full h-full object-cover rounded-xl shadow-2xl transition-transform transform hover:scale-105 hover:shadow-2xl" /> {/* Increased height */}
                <span className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">{formatDuration(duration)}</span>
            </div>
            <div className="pt-4 flex">
                
                    <img src={ownerAvatar} className="w-10 h-10 rounded-full mr-3 object-cover" alt="Owner Avatar" />
                
                <div className="flex-1"> {/* Allow this div to grow */}
               
                    <h2 className="text-md font-semibold text-white truncate">{title}</h2> {/* Truncate long titles */}
                    <div className="text-sm text-gray-400">
                           <p className="truncate">{channelName}</p> {/* Truncate long channel names */}
                        {/* </Link> */}
                        <p>{views} views • {uploadDate}</p>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Card;










