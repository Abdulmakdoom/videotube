import React from "react";
import {Link} from 'react-router-dom'

function Card({ title, duration, thumbnail, ownerAvatar, channelName, views, uploadDate, className = "", ...props }) {
    return (
        // <Link to={`/post/${$id}`}>   // Edit part
        <div className={`bg-white shadow-lg rounded-lg overflow-hidden ${className}`} {...props}>
            <div className="relative">
                <img src={thumbnail} alt={title} className="w-full h-70  object-cover rounded-t-lg" /> {/* Increased height */}
                <span className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">{duration}</span>
            </div>
            <div className="p-4 flex">
                <img src={ownerAvatar} className="w-10 h-10 rounded-full mr-3" alt="Owner Avatar" />
                <div className="flex-1"> {/* Allow this div to grow */}
                    <h2 className="text-md font-semibold text-gray-800 truncate">{title}</h2> {/* Truncate long titles */}
                    <div className="text-sm text-gray-600">
                        <p className="truncate">{channelName}</p> {/* Truncate long channel names */}
                        <p>{views} views • {uploadDate}</p>
                    </div>
                </div>
            </div>
        </div>
        // </Link>
    );
}

export default Card;
