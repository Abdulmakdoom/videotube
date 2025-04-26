import React, {useState, useEffect} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as darkHeart} from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import fetchWithAuth from "../utils/api";


// Utility function to format the like count
const formatNumber = (number) => {
    if (number >= 1_000_000) {
      return (number / 1_000_000).toFixed(1) + 'M'; // Format as millions
    } else if (number >= 1_000) {
      return (number / 1_000).toFixed(1) + 'K'; // Format as thousands
    }
    return number; // Return the number as is if less than 1000
  };

function CommentLike({commentId, userId}) {
    const [likeUsers, setLikeUsers] = useState([])
    const [commentLikeCount, setCommentLikeCount] = useState(0);
    const [showModalId, setShowModalId] = useState(null); // Track which comment's modal is visible
    let url = import.meta.env.VITE_API_URL
    
    
    const commentLikeHandler = async()=> {
        const response = await fetchWithAuth(`${url}/api/v1/likes/toggle/v/comment/${commentId}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
        const result = await response.json()
        fetchInitialLikeCount()
    }



    const fetchInitialLikeCount = async () => {          
        const response = await fetchWithAuth(`${url}/api/v1/likes/videos/c/${commentId}`, {
        credentials: 'include',
        });
        const result = await response.json();
        //console.log(result.data.likeComment);
        
        if (result.success) {
        setCommentLikeCount(result.data.LikeCommentCount);
        setLikeUsers(result.data.likeComment)
        }
    };

    let findUser = likeUsers.some((user)=> user.likedBy === userId? true : false)

    useEffect(() => {
        fetchInitialLikeCount()
    },[])


    const toggleCommentHandler = (id) => { 
        setShowModalId(prevState => prevState === id ? null : id);

    };

    

    return (
        <>
        {userId ? (
            <button className="text-gray-400" onClick={() => commentLikeHandler()}>
            <FontAwesomeIcon icon={findUser ? darkHeart : faHeart} className={findUser ? 'text-red-600' : ''} />
            <span className="ml-1 text-gray-400">{formatNumber(commentLikeCount)}</span>
            </button>
        ) : (
            <>
            <button className="text-gray-400" onClick={()=> (toggleCommentHandler(commentId))}>
                <FontAwesomeIcon icon={findUser ? darkHeart : faHeart} className={findUser ? 'text-red-600' : ''} />
                <span className="ml-1">{formatNumber(commentLikeCount)}</span>
            </button>
            {showModalId === commentId && (<div className="popup-message absolute flex justify-center items-center mt-25 bg-opacity-50 z-50">
                    <div className="bg-white p-3 rounded-lg shadow-xl w-50">
                        <div className="flex justify-between items-center">
                        <h2 className="text-sm ml-7 font-semibold text-gray-800">Log in to continue</h2>
                        </div>
                        <div className="mt-2 flex justify-center">
                          <Link to="/login" >
                            <button
                                className="bg-red-500 font-bold text-white py-2 px-6 rounded-lg hover:bg-red-600 focus:outline-none"
                            >
                                Log in
                            </button>
                          </Link>
                        </div>
                    </div>
                </div>)
            }
           </>
        )}
    </>

    )
}

export default CommentLike;

