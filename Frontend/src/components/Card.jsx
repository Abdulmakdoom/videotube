import React from "react";
import {Link} from 'react-router-dom'

function Card({ title, duration, thumbnail, ownerAvatar, channelName, views, uploadDate, className = "", ...props }) {
    return (
        // <Link to={`/post/${$id}`}>   // Edit part
            <div className={`bg-white shadow-lg rounded-lg overflow-hidden ${className}`} {...props}>
                <div className="relative">
                    <img src={thumbnail} alt={title} className="w-full h-auto rounded-t-lg" />
                    <span className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">{duration}</span>
                </div>
                <div className="p-4 flex">
                    <img src={ownerAvatar} className="w-10 h-10 rounded-full mr-3" />
                    <div>
                        <h2 className="text-md font-semibold mr-20 text-gray-800">{title}</h2>
                        <div className="mr-22">
                        <p className="text-sm mr-13 text-gray-600">{channelName}</p>
                        <p className="text-sm text-gray-600">{views} views • {uploadDate}</p>
                        </div>
                    </div>
                </div>
            </div>
        // </Link>
    );
}

export default Card;
