// import React, { useEffect, useState } from "react";
// import Input from "./Input";
// import Button from "./Button";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHeart } from '@fortawesome/free-regular-svg-icons';
// import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

// // TODO: comment upload time 
// function CommentBox ({videoId, className, formatNumber, userId}) {
//     const [input, setInput] = useState({content: ""})
//     // const [error, setError] = useState("")
//     const [getComments, setGetComments] = useState([])
//     const [commentCount, setCommentCount] = useState("")
//     const [showModal, setShowModal] = useState(false);

    

//     const inputHandler = (e)=> {
//         let {value} = e.target;
//         setInput((prevData)=> ({
//             ...prevData,
//             content: value
//         }))
//     }
//     // console.log(input);
   
//     const formDataHandler = async(e)=> {
//         e.preventDefault()
//         // setError("")

//         try {

//             //---------------------------response 1
//             const response = await fetch(`/api/v1/comments/${videoId}`, {
//                 method: "POST",
//                 credentials: "include", // Ensures cookies are sent
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(input),
//             })

//             const result = await response.json()

//             if(!response.ok){
//                 throw new Error(result.message || "Something went wrong")
//             }

//             //console.log(result.data);
            

//             setInput({ content: "" });


//             //-----------------------------response 2
//             try {
//                 let response = await fetch(`/api/v1/comments/${videoId}`)
//                 let result = await response.json()
//                 //console.log(result);
    
//                 setGetComments(result?.data?.comments)
//                 setCommentCount(result?.data?.totalComments)
    
//                 //console.log(result.data);
    
//                 if(!response.ok){
//                     throw new Error(result?.message || "Something went wrong")
//                 }
//             } catch (error) {
//                 // setError(error.message)
//                 console.log(error.message);
                
//             }
//             // Update the comments list instantly by adding the new comment
//             //setGetComments((prevData) => [...prevData, result.data]);

//             // console.log(input);
//             //console.log(videoId);
//         } catch (error) {
//             // setError(error.message)
//             console.log(error.message);
            
//         }

//     }

//     useEffect(()=> {
//             const fetchcomments = async()=> {
//                 try {
//                     let response = await fetch(`/api/v1/comments/${videoId}`)
//                     let result = await response?.json()
//                     //console.log(result);
        
//                     setGetComments(result?.data?.comments)
//                     setCommentCount(result?.data?.totalComments)
        
//                     //console.log(result.data);
        
//                     if(!response.ok){
//                         throw new Error(result?.message || "Something went wrong")
//                     }
//                 } catch (error) {
//                     // setError(error.message)
//                     console.log(error.message);
                    
//                 }
//             }
//             fetchcomments()
//     }, [])

//    //console.log(getComments);

//     const deleteCommentHandler = async(commentId)=> {
//         try {
//             let response = await fetch(`/api/v1/comments/c/${commentId}`, {
//                 method: 'DELETE',
//                 credentials: "include",
//             })
//             let result = await response.json()

//             if(!response.ok){
//                 throw new Error(result?.message || "Something went wrong")
//             }
            
//         } catch (error) {
//             console.log(error.message);
            
//         }
//     }

//       const toggleCommentDeleteHandler = ()=> {
//         setShowModal((prevData)=> !prevData)
//       }

//       console.log(showModal);

   

//     return(
//         <>
//         {/* {error && <p className="text-red-600 mt-4 text-center font-medium">{error}</p>} */}

//         <div className="ml-5 text-xl font-bold mb-3">
//             <h1>{formatNumber(commentCount)} Comments</h1>
//         </div>
//         <form onSubmit={formDataHandler} >
//            <div className={className}>
//            <Input  onChange={inputHandler} value={input.content} type="text" name="content" placeholder="Add a comment..."/>
//             {userId? <Button type="submit" className="bg-red-600"> Send</Button> : <Button disabled className="bg-gray-400"> Send</Button>}
               
//            </div>
//         </form>

//         {/* {comment box} */}
//         <div className="space-y-4">
//         <div>
//             {getComments?.map((data, index) => (
//             <div key={index} className="flex items-start space-x-4 p-4 border-b border-gray-300">
//                     {/* Avatar */}
//                     <div className="flex-shrink-0">
//                     <img
//                         src={data?.ownerDetails?.avatar} // Replace with actual avatar image URL
//                         alt="User Avatar"
//                         className="w-10 h-10 rounded-full"
//                     />
//                     </div>

//                     {/* Comment content */}
//                     <div className="flex-1">
//                         {/* Username */}
//                         <div className="flex items-center justify-between text-sm font-semibold text-gray-800">
//                             <div className="truncate">{data?.ownerDetails?.username}</div>
//                             {/* <button onClick={() => deleteCommentHandler(data._id)} className="ml-3 sm:text-sm mr-12">
//                             <FontAwesomeIcon icon={faEllipsisVertical} />
//                             </button> */}
//                                 {/* Modal to confirm deletion */}
//                                 {showModal && (
//                                         <div className=" flex items-center justify-center z-50">
//                                             <div className="bg-white rounded shadow-lg p-4 w-80"> 
//                                                 <div className="flex justify-end">
//                                                     <button 
//                                                         onClick={() => deleteCommentHandler(data._id)}
//                                                         className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2">
//                                                         Delete
//                                                     </button>
//                                                     {/* <button 
//                                                         onClick={() => setShowModal(false)} // Assuming you have a function to close the modal
//                                                         className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
//                                                         Cancel
//                                                     </button> */}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}
//                             <button onClick={toggleCommentDeleteHandler} className="w-9 h-9 ml-3 sm:text-sm mr-12">
//                                 <FontAwesomeIcon icon={faEllipsisVertical} />
//                             </button>
//                         </div>

//                         {/* Comment text */}
//                         <div className="text-sm text-gray-700 mt-2 sm:mt-1">
//                             {data.content}
//                         </div>

//                         {/* Actions (like, reply, etc.) */}
//                         <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
//                             <button className="hover:text-red-600">
//                             <FontAwesomeIcon icon={faHeart} />
//                             </button>
//                             <button className="hover:text-red-600">Reply</button>
//                         </div>

//                     </div>
//                 </div>
//                 ))}
//             </div>
//         </div>

//         </>
//     )
// }

// export default CommentBox;




// import React, { useEffect, useState } from "react";
// import Input from "./Input";
// import Button from "./Button";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHeart } from '@fortawesome/free-regular-svg-icons';
// import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

// function CommentBox ({videoId, className, formatNumber, userId}) {
//     const [input, setInput] = useState({content: ""});
//     const [getComments, setGetComments] = useState([]);
//     const [commentCount, setCommentCount] = useState("");
//     const [modalState, setModalState] = useState({}); // Track modal visibility for each comment

//     const inputHandler = (e) => {
//         let { value } = e.target;
//         setInput((prevData) => ({
//             ...prevData,
//             content: value
//         }));
//     };

//     const formDataHandler = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await fetch(`/api/v1/comments/${videoId}`, {
//                 method: "POST",
//                 credentials: "include",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(input),
//             });

//             const result = await response.json();

//             if (!response.ok) {
//                 throw new Error(result.message || "Something went wrong");
//             }

//             setInput({ content: "" });

//             // Fetch updated comments
//             const responseComments = await fetch(`/api/v1/comments/${videoId}`);
//             const resultComments = await responseComments.json();

//             if (!responseComments.ok) {
//                 throw new Error(resultComments?.message || "Something went wrong");
//             }

//             setGetComments(resultComments?.data?.comments);
//             setCommentCount(resultComments?.data?.totalComments);

//         } catch (error) {
//             console.log(error.message);
//         }
//     };

//     useEffect(() => {
//         const fetchComments = async () => {
//             try {
//                 const response = await fetch(`/api/v1/comments/${videoId}`);
//                 const result = await response.json();

//                 if (!response.ok) {
//                     throw new Error(result?.message || "Something went wrong");
//                 }

//                 setGetComments(result?.data?.comments);
//                 setCommentCount(result?.data?.totalComments);
//             } catch (error) {
//                 console.log(error.message);
//             }
//         };

//         fetchComments();
//     }, [videoId]);

//     const deleteCommentHandler = async (commentId) => {
//         try {
//             const response = await fetch(`/api/v1/comments/c/${commentId}`, {
//                 method: 'DELETE',
//                 credentials: "include",
//             });
//             const result = await response.json();

//             if (!response.ok) {
//                 throw new Error(result?.message || "Something went wrong");
//             }

//             // Optionally remove comment from state after successful deletion
//             setGetComments(getComments.filter((comment) => comment._id !== commentId));

//         } catch (error) {
//             console.log(error.message);
//         }
//     };

//     const toggleCommentDeleteHandler = (commentId) => {
//         setModalState((prevState) => ({
//             ...prevState,
//             [commentId]: !prevState[commentId]  // Toggle visibility for the clicked comment
//         }));
//     };

//     return (
//         <>
//             <div className="ml-5 text-xl font-bold mb-3">
//                 <h1>{formatNumber(commentCount)} Comments</h1>
//             </div>
//             <form onSubmit={formDataHandler}>
//                 <div className={className}>
//                     <Input onChange={inputHandler} value={input.content} type="text" name="content" placeholder="Add a comment..." />
//                     {userId ? <Button type="submit" className="bg-red-600">Send</Button> : <Button disabled className="bg-gray-400">Send</Button>}
//                 </div>
//             </form>

//             <div className="space-y-4">
//                 {getComments.map((data) => (
//                     <div key={data._id} className="flex items-start space-x-4 p-4 border-b border-gray-300">
//                         {/* Avatar */}
//                         <div className="flex-shrink-0">
//                             <img
//                                 src={data?.ownerDetails?.avatar} // Replace with actual avatar image URL
//                                 alt="User Avatar"
//                                 className="w-10 h-10 rounded-full"
//                             />
//                         </div>

//                         {/* Comment content */}
//                         <div className="flex-1">
//                             {/* Username */}
//                             <div className="flex items-center justify-between text-sm font-semibold text-gray-800">
//                                 <div className="truncate">{data?.ownerDetails?.username}</div>

//                                 {/* Modal to confirm deletion */}
//                                 {modalState[data._id] && (
//                                   <div className="">
//                                   <div className="absolute right-0 transform translate-x-4  mt-4 bg-gray-300 rounded shadow-lg p-1 sm:p-1 mr-24 w-30 sm:w-30 z-50">
//                                       <div className="flex justify-end">
//                                           <button
//                                               onClick={() => deleteCommentHandler(data._id)}
//                                               className="px-4 py-2 rounded mr-4">
//                                               Delete
//                                           </button>
//                                       </div>
//                                   </div>
//                               </div>
//                                 )}

//                                 {/* Ellipsis button to show modal */}
//                                 <button onClick={() => toggleCommentDeleteHandler(data._id)} className="w-9 h-9 ml-3 sm:text-sm mr-12">
//                                     <FontAwesomeIcon icon={faEllipsisVertical} />
//                                 </button>
//                             </div>

//                             {/* Comment text */}
//                             <div className="text-sm text-gray-700 mt-2 sm:mt-1">
//                                 {data.content}
//                             </div>

//                             {/* Actions (like, reply, etc.) */}
//                             <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
//                                 <button className="hover:text-red-600">
//                                     <FontAwesomeIcon icon={faHeart} />
//                                 </button>
//                                 <button className="hover:text-red-600">Reply</button>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </>
//     );
// }

// export default CommentBox;






import React, { useEffect, useState } from "react";
import {Input, Button, CommentLike} from "./allComponents.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faEllipsisVertical, faTrashCan} from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

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
            const response = await fetch(`${url}/api/v1/comments/${videoId}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input),
            });

            const result = await response.json();
            //console.log(result);            

            if (!response.ok) {
                throw new Error(result.message || "Something went wrong");
            }

            setInput({ content: "" });

            // Fetch updated comments
            const responseComments = await fetch(`${url}/api/v1/comments/${videoId}`, {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const resultComments = await responseComments.json();

            if (!responseComments.ok) {
                throw new Error(resultComments?.message || "Something went wrong");
            }
            //console.log(resultComments?.data?.comments?.[0]?.video);
            
           
            setGetComments(resultComments?.data?.comments);
            setCommentCount(resultComments?.data?.totalComments);


        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`${url}/api/v1/comments/${videoId}`, {
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
                console.log(error.message);
            }
        };

        fetchComments();
    }, [videoId]);

    const deleteCommentHandler = async (commentId) => {
        try {
            const response = await fetch(`${url}/api/v1/comments/c/${commentId}`, {
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
            console.log(error.message);
        }
    };

    const toggleCommentDeleteHandler = (commentId) => {
        // Show the modal for the clicked comment, and close others
        setShowModalId((prevState) => (prevState === commentId ? null : commentId));
    };


    console.log();
    

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


                        {/* {console.log(data.ownerDetails._id)} */}
                        
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
                                {/* <button className="hover:text-red-600 text-gray-400">Reply</button> */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default CommentBox;









// import React, { useEffect, useState } from "react";
// import Input from "./Input";
// import Button from "./Button";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHeart, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
// import { faEllipsisVertical} from '@fortawesome/free-solid-svg-icons';

// function CommentBox({ videoId, className, formatNumber, userId }) {
//     const [input, setInput] = useState({ content: "" });
//     const [getComments, setGetComments] = useState([]);
//     const [commentCount, setCommentCount] = useState("");
//     const [commentLikes, setCommentLikes] = useState({});  // Track like count for each comment
//     const [showModalId, setShowModalId] = useState(null); // Track which comment's modal is visible

//     const inputHandler = (e) => {
//         let { value } = e.target;
//         setInput((prevData) => ({
//             ...prevData,
//             content: value
//         }));
//     };

//     const formDataHandler = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await fetch(`/api/v1/comments/${videoId}`, {
//                 method: "POST",
//                 credentials: "include",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(input),
//             });

//             const result = await response.json();

//             if (!response.ok) {
//                 throw new Error(result.message || "Something went wrong");
//             }

//             setInput({ content: "" });

//             // Fetch updated comments
//             const responseComments = await fetch(`/api/v1/comments/${videoId}`);
//             const resultComments = await responseComments.json();

//             if (!responseComments.ok) {
//                 throw new Error(resultComments?.message || "Something went wrong");
//             }

//             setGetComments(resultComments?.data?.comments);
//             setCommentCount(resultComments?.data?.totalComments);

//             // Update like counts for the newly fetched comments
//             const initialLikes = {};
//             resultComments?.data?.comments.forEach(comment => {
//                 initialLikes[comment._id] = comment.likeCount || 0;
//             });
//             setCommentLikes(initialLikes);

//         } catch (error) {
//             console.log(error.message);
//         }
//     };

//     useEffect(() => {
//         const fetchComments = async () => {
//             try {
//                 const response = await fetch(`/api/v1/comments/${videoId}`);
//                 const result = await response.json();

//                 if (!response.ok) {
//                     throw new Error(result?.message || "Something went wrong");
//                 }

//                 setGetComments(result?.data?.comments);
//                 setCommentCount(result?.data?.totalComments);

//                 // Set initial like counts for each comment
//                 const initialLikes = {};
//                 result?.data?.comments.forEach(comment => {
//                     initialLikes[comment._id] = comment.likeCount || 0;
//                 });
//                 setCommentLikes(initialLikes);
//             } catch (error) {
//                 console.log(error.message);
//             }
//         };

//         fetchComments();
//     }, [videoId]);

//     const deleteCommentHandler = async (commentId) => {
//         try {
//             const response = await fetch(`/api/v1/comments/c/${commentId}`, {
//                 method: 'DELETE',
//                 credentials: "include",
//             });
//             const result = await response.json();

//             if (!response.ok) {
//                 throw new Error(result?.message || "Something went wrong");
//             }

//             // Remove the comment from the state after successful deletion
//             setGetComments(getComments.filter((comment) => comment._id !== commentId));
//             setShowModalId(null); // Close the modal after deletion

//         } catch (error) {
//             console.log(error.message);
//         }
//     };

//     const toggleCommentDeleteHandler = (commentId) => {
//         setShowModalId((prevState) => (prevState === commentId ? null : commentId));
//     };

//     const commentLikeHandler = async (commentId) => {
//         console.log(commentId);
//         try {
//             const response = await fetch(`/api/v1/likes/toggle/v/comment/${commentId}`, {
//                 method: "POST",
//                 credentials: "include",
//             });
//             const result = await response.json();
//             console.log(result);

//             // Update the like count for the specific comment
//             if (result.success) {
//                 setCommentLikes((prevState) => ({
//                     ...prevState,
//                     [commentId]: result.data.likeCount,
//                 }));
//             }

//         } catch (error) {
//             console.log(error.message);
//         }
//     };

//     return (
//         <>
//             <div className="ml-5 text-xl font-bold mb-3">
//                 <h1>{formatNumber(commentCount)} Comments</h1>
//             </div>
//             <form onSubmit={formDataHandler}>
//                 <div className={className}>
//                     <Input onChange={inputHandler} value={input.content} type="text" name="content" placeholder="Add a comment..." />
//                     {userId ? <Button type="submit" className="bg-red-600"><FontAwesomeIcon icon={faPaperPlane} /></Button> : <Button disabled className="bg-gray-400"><FontAwesomeIcon icon={faPaperPlane} /></Button>}
//                 </div>
//             </form>

//             <div className="space-y-4">
//                 {getComments.map((data) => (
//                     <div key={data._id} className="flex items-start space-x-4 p-4 border-b border-gray-300">
//                         {/* Avatar */}
//                         <div className="flex-shrink-0">
//                             <img
//                                 src={data?.ownerDetails?.avatar} // Replace with actual avatar image URL
//                                 alt="User Avatar"
//                                 className="w-10 h-10 rounded-full"
//                             />
//                         </div>

//                         {/* Comment content */}
//                         <div className="flex-1">
//                             {/* Username */}
//                             <div className="flex items-center justify-between text-sm font-semibold text-gray-800">
//                                 <div className="truncate">{data?.ownerDetails?.username}</div>

//                                 {/* Modal to confirm deletion */}
//                                 {showModalId === data._id && (
//                                   <div className="absolute right-0 transform translate-x-4 mt-21 bg-gray-300 rounded shadow-lg p-1 sm:p-1 mr-24 w-30 sm:w-30 z-50">
//                                       <div className="flex justify-end">
//                                           <button
//                                               onClick={() => deleteCommentHandler(data._id)}
//                                               className="px-4 py-2 rounded mr-4">
//                                               Delete
//                                           </button>
//                                       </div>
//                                   </div>
//                                 )}

//                                 {/* Ellipsis button to show modal */}
//                                 <button onClick={() => toggleCommentDeleteHandler(data._id)} className="w-9 h-9 ml-3 sm:text-sm mr-12">
//                                     <FontAwesomeIcon icon={faEllipsisVertical} />
//                                 </button>
//                             </div>

//                             {/* Comment text */}
//                             <div className="text-sm text-gray-700 mt-2 sm:mt-1">
//                                 {data.content}
//                             </div>

//                             {/* Actions (like, reply, etc.) */}
//                             <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
//                                 <button onClick={() => commentLikeHandler(data._id)} className="hover:text-red-600">
//                                     <FontAwesomeIcon icon={faHeart} />
//                                     <span className="ml-1">{commentLikes[data._id] || 0}</span>
//                                 </button>
//                                 <button className="hover:text-red-600">Reply</button>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </>
//     );
// }

// export default CommentBox;
