import React, { useEffect, useState } from "react";
import {Input, Button, CommentLike} from "./allComponents.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faEllipsisVertical, faTrashCan} from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import fetchWithAuth from "../utils/api.js";


function CommentBox ({videoId, className, formatNumber, userId}) {
    const [input, setInput] = useState({content: ""});
    const [getComments, setGetComments] = useState([]);
    const [commentCount, setCommentCount] = useState("");
    const [showModalId, setShowModalId] = useState(null); // Track which comment's modal is visible
    const [commentVideoUserData, setCommentVideoUserData] = useState("")
    let url = import.meta.env.VITE_API_URL
    
    const inputHandler = (e) => {
        let { value } = e.target;
        setInput((prevData) => ({
            ...prevData,
            content: value
        }));
    };

    const formDataHandler = async (e) => {
        e.preventDefault();

        try {
            const response = await fetchWithAuth(`${url}/api/v1/comments/${videoId}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            });

            const result = await response.json();           

            if (!response.ok) {
                throw new Error(result.message || "Something went wrong");
            }

            setInput({ content: "" });

            // Fetch updated comments
            const responseComments = await fetchWithAuth(`${url}/api/v1/comments/${videoId}`, {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const resultComments = await responseComments.json();

            if (!responseComments.ok) {
                throw new Error(resultComments?.message || "Something went wrong");
            }
            
           
            setGetComments(resultComments?.data?.comments);
            setCommentCount(resultComments?.data?.totalComments);


        } catch (error) {
            //console.log(error.message);
        }
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetchWithAuth(`${url}/api/v1/comments/${videoId}`, {
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result?.message || "Something went wrong");
                }

                setCommentVideoUserData(result?.data?.comments?.[0]?.video)
                setGetComments(result?.data?.comments);
                setCommentCount(result?.data?.totalComments);
                //setGetCommentsLike(getComments.filter((comment) => comment._id !== commentId));

            } catch (error) {
                //console.log(error.message);
            }
        };

        fetchComments();
    }, [videoId]);

    const deleteCommentHandler = async (commentId) => {
        try {
            const response = await fetchWithAuth(`${url}/api/v1/comments/c/${commentId}`, {
                method: 'DELETE',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result?.message || "Something went wrong");
            }

            // Remove the comment from the state after successful deletion
            setGetComments(getComments.filter((comment) => comment._id !== commentId));
            setShowModalId(null); // Close the modal after deletion

        } catch (error) {
            //console.log(error.message);
        }
    };

    const toggleCommentDeleteHandler = (commentId) => {
        // Show the modal for the clicked comment, and close others
        setShowModalId((prevState) => (prevState === commentId ? null : commentId));
    };


    

    return (
        <>
            <div className="ml-5 text-xl font-bold mb-3 text-white">
                <h1>{formatNumber(commentCount)} Comments</h1>
            </div>
            <form onSubmit={formDataHandler}>
                <div className={className}>
                    <Input onChange={inputHandler} value={input.content} type="text" name="content" placeholder="Add a comment..." className="placeholder-gray-400 text-white"/>
                    {userId ? <Button type="submit" className="bg-red-600"><FontAwesomeIcon icon={faPaperPlane} /></Button> : <Button disabled className="bg-gray-600"><FontAwesomeIcon icon={faPaperPlane} /></Button>}
                </div>
            </form>

            <div className="space-y-4">
                {getComments.map((data) => (
                    <div key={data._id} className="flex items-start space-x-4 p-4 border-gray-300">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <Link to={`/${data?.ownerDetails?.username}`}>
                                <img
                                    src={data?.ownerDetails?.avatar} // Replace with actual avatar image URL
                                    alt="User Avatar"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            </Link>
                        </div>
                        
                        {/* Comment content */}
                        <div className="flex-1">
                            {/* Username */}
                            <div className="flex items-center justify-between text-sm font-semibold text-white">
                                <Link to={`/${data?.ownerDetails?.username}`}>
                                    <div className="truncate">{data?.ownerDetails?.username}</div>
                                </Link>  


                                {/* Comment to confirm deletion */}
                                {showModalId === data._id && (
                                  <div className="absolute right-0 transform translate-x-4 mt-21 bg-[#696868] text-black rounded-2xl shadow-lg p-1 sm:p-1 mr-24 w-30 sm:w-30 z-50">
                                      <div className="flex justify-end">
                                          <button
                                              onClick={() => deleteCommentHandler(data._id)}
                                              className="px-4 py-2 rounded mr-2">
                                              <FontAwesomeIcon icon={faTrashCan} className="mr-2"/>Delete
                                          </button>
                                      </div>
                                  </div>
                                )}

                                {/* Ellipsis button to show modal */}
                                {data.ownerDetails._id === userId && <button onClick={()=> toggleCommentDeleteHandler(data._id)} className="w-9 h-9 ml-3 sm:text-sm mr-12">
                                    <FontAwesomeIcon icon={faEllipsisVertical} />
                                </button>}
                            </div>

                            {/* Comment text */}
                            <div className="text-sm text-white mt-2 sm:mt-1">
                                {data.content}
                            </div>

                            {/* Actions (like, reply, etc.) */}
                            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                                <CommentLike commentId={data._id} userId={userId} showModalId={showModalId}/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default CommentBox;