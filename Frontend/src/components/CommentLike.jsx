import React, {useState, useEffect} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as darkHeart} from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

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
    // const [showModal, setShowModal] = useState(false); 
    const [showModalId, setShowModalId] = useState(null); // Track which comment's modal is visible
    let url = "http://localhost:8000" || "https://videotube-e1hm.onrender.com"
    
    
    

    //console.log(commentId);
    //console.log(userId);
    
    
    const commentLikeHandler = async()=> {
        const response = await fetch(`${url}/api/v1/likes/toggle/v/comment/${commentId}`, {
            method: "POST",
            credentials: "include",
        })
        const result = await response.json()
        //console.log(result);
        fetchInitialLikeCount()
    }

    //console.log(commentLikeCount);

    const fetchInitialLikeCount = async () => {   
    //console.log(commentId.commentId);         
        const response = await fetch(`${url}/api/v1/likes/videos/c/${commentId}`, {
        credentials: 'include',
        });
        const result = await response.json();
        //console.log(result.data.likeComment);
        
        if (result.success) {
        setCommentLikeCount(result.data.LikeCommentCount);
        setLikeUsers(result.data.likeComment)
        }
    };

    // const popupHandler= (()=> {
    //     setShowModal((prevData)=> !prevData)
    // })

    //console.log(likeUsers);

    let findUser = likeUsers.some((user)=> user.likedBy === userId? true : false)

    useEffect(() => {
        fetchInitialLikeCount()
    },[])


    const toggleCommentHandler = (id) => { 
        setShowModalId(prevState => prevState === id ? null : id);

    };

    // console.log(showModalId);
    

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
                                // onClick={loginHandler}
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




{/* <>
            <button onClick={popupHandler}>
                <FontAwesomeIcon icon={findUser ? darkHeart : faHeart} className={findUser ? 'text-red-600' : ''} />
                <span className="ml-1">{commentLikeCount}</span>
            </button>
                {showModal && <div className="popup-message absolute flex justify-center items-center ml-10 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">Log in to continue</h2>
                        <button onClick={popupHandler} className="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        </div>
                        <p className="mt-4 text-center text-gray-700">Please log in to like the comment.</p>
                        <div className="mt-6 flex justify-center">
                        <button
                            // onClick={loginHandler}
                            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 focus:outline-none"
                        >
                            Log in
                        </button>
                        </div>
                    </div>
                </div>}
           </> */}