import React, { use, useEffect, useState } from "react";
import { BiLike, BiSolidLike} from "react-icons/bi";
import { IoMdMore } from "react-icons/io";
import { useParams } from "react-router-dom";
import timeAgo from "./time";





function PostCard({ avatar, channelName, uploadTime, content, postId, likes, className, postData, userId, data}) {
  
    const [liked, setLiked] = useState(false);
    const [popupMsg, setPopupMsg] = useState(false)

    
    
    const deleteHandler = async()=> {
  
        try {
            const response = await fetch(`/api/v1/tweets/${postId}`, {
                method: "DELETE",
                credentials: "include"
            })

            if(response.ok){
                window.location.reload();
                alert('Post deleted')
            }
        } catch (error) {
            console.log(error.message);
        }

    }


    const popupHandler = ()=> {
        setPopupMsg(!popupMsg)
    }


    
  // Toggle the like state
  const handleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className={`bg-white border rounded-lg shadow-md p-4 mb-4 max-w-4xl mx-auto ${className}`}>
        {/* Header with Avatar and Channel Name */}
        <div className="flex items-center mb-3">
            <img
                src={avatar}
                alt="Avatar"
                className="w-12 h-12 rounded-full mr-3"
            />
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{channelName}</h3>
                    <div className="relative">
                        <IoMdMore 
                            onClick={popupHandler} 
                            className="ml-auto sm:ml-5 md:ml-10 lg:ml-15 text-2xl cursor-pointer"
                        />
                        {/* Popup Message with enhanced styling */}
                        {popupMsg && (
                            <div className="absolute right-0 top-8 bg-gray-800 text-white rounded-lg shadow-xl opacity-70 w-20 sm:w-25 md:w-25 lg:w-30 transform transition-all ease-in-out duration-300">
                                <button onClick={deleteHandler} className="w-full text-center text-xs sm:text-sm md:text-base py-2 sm:py-3 px-4 sm:px-4 rounded-md  transition-colors">
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <p className="text-sm text-gray-500">{uploadTime}</p>
            </div>
        </div>

        {/* Post Content */}
        <p className="text-gray-800 text-base mb-3">{content}</p>

        {/* Actions - Likes */}
        <div className="flex items-center space-x-4 text-gray-600">
            <button
                onClick={handleLike}
                className="flex items-center space-x-1"
            >
                {liked ? <BiSolidLike className="text-red-800" /> : <BiLike />}
            </button>
        </div>
    </div>
 
  );
}

export default PostCard;

