
import React, { use, useEffect, useState } from "react";
import { BiLike, BiSolidLike, BiShare, BiComment} from "react-icons/bi";
import { IoMdMore } from "react-icons/io";
import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import timeAgo from "./time";

// Utility function to format the like count
const formatNumber = (number) => {
    if (number >= 1_000_000) {
      return (number / 1_000_000).toFixed(1) + 'M'; // Format as millions
    } else if (number >= 1_000) {
      return (number / 1_000).toFixed(1) + 'K'; // Format as thousands
    }
    return number; // Return the number as is if less than 1000
  };

function PostCard({ avatar, channelName, uploadTime, content, postId, likes, className, postData, userId, data }) {
  
    // const [liked, setLiked] = useState(false);
    const [liked, setLiked] = useState([]);
    const [popupMsg, setPopupMsg] = useState(false)
    const [likeData, setLikeData] = useState([]);
    const [shareMessage, setShareMessage] = useState("");

    const userData2 = useSelector((state) => state.auth.userData);
    const userId2 = userData2?._id;
    const url = "https://videotube-mggc.onrender.com" || "http://localhost:8000"


  
    const deleteHandler = async () => {
        try {
            const response = await fetch(`${url}/api/v1/tweets/${postId}`, {
                method: "DELETE",
                credentials: "include"
            })

            if (response.ok) {
                window.location.reload();
                alert('Post deleted')
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const popupHandler = () => {
        setPopupMsg(!popupMsg)
    }

    // Toggle the like state
    const handleLike = async () => {
        const response = await fetch(`${url}/api/v1/likes/toggle/v/tweet/${postId}`, {
            method: "POST",
            credentials: "include"
        })
        const result = await response.json()
        setLikeData(result)
    };

    const getLikes = async () => {
        const response = await fetch(`${url}/api/v1/likes/post/c/${postId}`)
        const result = await response.json()
        setLiked(result)
    };

    useEffect(() => {
        getLikes()
    }, [likeData]);

    let findUser = liked?.data?.likePost.some((user) => user?.likedBy === userId2 ? true : false)

    // Share handler: Copy the post URL to clipboard
    const handleShare = async () => {
        const postUrl = `${window.location.origin}/posts/${postId}`; // Assuming post URL structure
        try {
            await navigator.clipboard.writeText(postUrl); // Copy to clipboard
            setShareMessage("Post link copied to clipboard!"); // Provide feedback to the user
            setTimeout(() => setShareMessage(""), 3000); // Clear message after 3 seconds
        } catch (error) {
            console.error("Failed to copy the link:", error);
            setShareMessage("Failed to copy the link.");
            setTimeout(() => setShareMessage(""), 3000); // Clear message after 3 seconds
        }
    }

    return (
        <div
            className={`bg-white border border-gray-200 rounded-lg shadow-lg p-6 mb-6 max-w-4xl mx-auto ${className}`}
        >
            {/* Header with Avatar and Channel Name */}
            <div className="flex items-center mb-4">
                <img
                    src={avatar}
                    alt="Avatar"
                    className="w-12 h-12 border-2 rounded-full mr-4 shadow-md object-cover"
                />
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-gray-800">{channelName}</h3>
                        {userId2 === userId && <div className="relative">
                            <IoMdMore
                                onClick={popupHandler}
                                className="text-2xl text-gray-600 cursor-pointer hover:text-gray-800 transition duration-200"
                            />
                            {/* Popup Message with enhanced styling */}
                            {popupMsg && (
                                <div
                                    className="absolute right-0 top-10 bg-gray-800 text-white rounded-lg shadow-xl opacity-90 w-20 transform transition-all ease-in-out duration-300"
                                    role="menu"
                                    aria-labelledby="more-options"
                                >
                                    <button
                                        onClick={deleteHandler}
                                        className="w-full text-center text-sm py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                                        role="menuitem"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>}
                    </div>
                    <p className="text-sm text-gray-500">{uploadTime}</p>
                </div>
            </div>

            {/* Post Content */}
            <p className="text-gray-800 text-base mb-4">{content}</p>

            {/* Media Content (Optional) */}
            {/* {media && (
            <div className="mb-4">
                <img
                src={media}
                alt="Post Media"
                className="rounded-lg shadow-md w-full h-auto object-cover"
                loading="lazy"
                />
            </div>
            )} */}

            {/* Actions - Likes, Comments, Share */}
            <div className="flex items-center justify-between text-gray-600">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleLike}
                        className="flex items-center space-x-1 hover:text-red-600 transition duration-200"
                        aria-label="Like this post"
                    >
                        {findUser ? (
                            <BiSolidLike className="text-red-600" />
                        ) : (
                            <BiLike className="text-gray-600" />
                        )}
                        <span className="text-sm">{formatNumber(liked?.data?.LikePostCount)}</span>
                    </button>
                    {/* <button
                        //   onClick={handleComment}
                        className="flex items-center space-x-1 hover:text-blue-600 transition duration-200"
                        aria-label="Comment on this post"
                    >
                        <BiComment />
                    </button> */}
                </div>
                <button
                    onClick={handleShare}
                    className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition duration-200"
                    aria-label="Share this post"
                >
                    <BiShare />
                    <span className="text-sm">Share</span>
                </button>
            </div>

            {/* Feedback message after sharing */}
            {shareMessage && (
                <div className="mt-2 text-green-500 text-sm">
                    {shareMessage}
                </div>
            )}
        </div>
    );
}

export default PostCard;
