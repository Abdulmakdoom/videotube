import React, { useEffect, useState } from "react";
import Container from "./container/Container";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "../utils/api";
import {CommentBox, timeAgo, Button, Spinner} from "./allComponents.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faDownload } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp, faBookmark } from '@fortawesome/free-regular-svg-icons';
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { Link } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";






// Utility function to format the like count
const formatNumber = (number) => {
  if (number >= 1_000_000) {
    return (number / 1_000_000).toFixed(1) + 'M'; // Format as millions
  } else if (number >= 1_000) {
    return (number / 1_000).toFixed(1) + 'K'; // Format as thousands
  }
  return number; // Return the number as is if less than 1000
};

function VideoPlayCard({
  videoFile,
  title,
  avatar,
  channelName,
  uploadTime,
  views,
  description,
  userChannelId,
}) {
    const [likes, setLikes] = useState(0);
    const [loader, setLoader] = useState(false);
    const [subscribersCount, setSubscribersCount] = useState(0)
    const [likeUsers, setLikeUsers] = useState([])
    let { videoId } = useParams();
    const [hasSeen30, setHasSeen30] = useState(false); 
    const [buttonPressed, setButtonPressed] = useState(false)
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [subscribeDone , setSubscrbeDone] = useState(false)
     const [shareMessage, setShareMessage] = useState("");
       const [open, setOpen]= useState(false)
    let navigate = useNavigate()
    const userData = useSelector((state) => state.auth.userData);
    const userId = userData?._id;

    let url = import.meta.env.VITE_API_URL
    
    //console.log(userId);        

  // Fetch the likes count when the component mounts
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response1 = await fetchWithAuth(`${url}/api/v1/likes/videos/${videoId}`, {
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
        },
        });
        const response2 = await fetchWithAuth(`${url}/api/v1/subscriptions/c/${userChannelId}`, {
          method: "GET",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
        },
        })

        const result = await response1.json();
        const result2 = await response2.json();
        //console.log(result2.data.subscribers);

        setLikeUsers(result.data.video)
        

        let data = result2.data.subscribers
        const match = data.find(item => item.subscriber._id === userId);
        let switchColor = match ? true : false;
        //console.log(switchColor);
        setSubscrbeDone(switchColor)
        //console.log(subscribeDone);
        
       // console.log(result2.data.countSubscribers);
        
        if (result.success) {
          setLikes(result.data.LikeVideoCount); // Update the like count from API response
        } else {
          console.error("Error fetching likes:", result.message);
        }

        if (result2.success) {
          setSubscribersCount(result2.data.countSubscribers); // Update the subscribers count from API response
        } else {
          console.error("Error fetching likes:", result2.message);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchLikes();
  }, [buttonPressed, likes]);
  

  

  const handleSubscribeButtion = async()=> {
   try {
    const response = await fetchWithAuth(`${url}/api/v1/subscriptions/c/${userChannelId}`, {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
    },
    })
    let result = await response.json()
     console.log(result);
     setButtonPressed(result)
     if (!result.success) {
      throw new Error("Failed to fetch video");
  }
   } catch (error) {
    console.error("Error during fetch:", error);
   }
  }

  const deleteHandler = async()=> {
    setLoader(true)
    try {
      const response = await fetchWithAuth(`${url}/api/v1/videos/${videoId}`, {
        method: "DELETE",
       credentials: "include",
       headers: {
        "Content-Type": "application/json",
    },
      })
      const result =  await response.json()
      //console.log(result);
      

      if (result.success) {
        setLoader(false)
        console.log("Delete successfully.");
        navigate(`/videos/${userId}`)
      } else {
        setLoader(false)
        console.error("Error Delete:", result.message);
      }
      
    } catch (error) {
      setLoader(false)
      console.error("Error during deletion:", error);
    }
  }


  // const editHandler = async()=> {
  //     navigate(`/home/videos/edit=${videoId}`)
  // }
  
  const handleVideoProgress = (event) => {
    const videoElement = event.target;
    const currentTime = videoElement.currentTime;
    const duration = videoElement.duration;

    // Check if 10% of the video has been watched
    if (currentTime >= duration * 0.01 && !hasSeen30) {
      setHasSeen30(true); // Set the flag to true so it doesn't trigger again

      // Call the API to increase the view count
      const updateViews = async () => {
        try {
          const response = await fetchWithAuth(`${url}/api/v1/videos/views/${videoId}`, {
            method: "POST", // Assuming the API uses POST to update views
            credentials: 'include',
            headers: {
              "Content-Type": "application/json",
          },
          });
          const result = await response.json();
          //console.log(result);
          
          if (result.success) {
            console.log("View count updated successfully.");
          } else {
            console.error("Error updating views:", result.message);
          }
        } catch (error) {
          console.error("Error during updating views:", error);
        }
      };

      updateViews();
    }
  };

  // Handle like button click
  const handleLike = async () => {
    try {
      const response = await fetchWithAuth(`${url}/api/v1/likes/toggle/v/video/${videoId}`, {
        method: "POST", // Assuming the API uses POST to toggle likes
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
      },
      });
      const data = await response.json();
      //console.log(data);
      
      if (data.success) {
        setLikes(data.likes); // Update the like count based on the response
      } else {
        console.error("Error toggling like:", data.message);
      }
    } catch (error) {
      console.error("Error during like action:", error);
    }
  };

   // Share handler: Copy the post URL to clipboard
   const handleShare = async () => {
    const videoUrl = `${window.location.origin}/home/videos/${videoId}`; // Assuming post URL structure
    try {
        await navigator.clipboard.writeText(videoUrl); // Copy to clipboard
        setShareMessage("Video link copied to clipboard!"); // Provide feedback to the user
        setTimeout(() => setShareMessage(""), 3000); // Clear message after 3 seconds
    } catch (error) {
        console.error("Failed to copy the link:", error);
        setShareMessage("Failed to copy the link.");
        setTimeout(() => setShareMessage(""), 3000); // Clear message after 3 seconds
    }
}

  // Toggle description visibility
  const toggleDescription = () => {
    setShowFullDescription((prevState) => !prevState);
  };

  // Truncate description if not showing full text
  const truncatedDescription = description.length > 200 ? description.slice(0, 200) + "..." : description;

  let findUser = likeUsers.some((user)=> user.likedBy === userId? true : false)

  const openHandler = ()=> {
    setOpen(!open)
  }
  

  return (
    <Container>
      <div className="w-full max-w-full mx-auto bg-[#0A0A0A] rounded-lg shadow-lg overflow-hidden mt-2 pl-20">
        {/* Video Section */}
        <div className="flex justify-center bg-black">
          <video
            className="w-full h-auto max-h-[300px] sm:max-h-[400px] md:max-h-[500px] lg:max-h-[600px] object-cover"
            src={videoFile}
            controls
            onTimeUpdate={handleVideoProgress} 
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Video Details Section */}
        <div className="p-4">
          {/* Title Section */}
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-white truncate">
            {title}
          </h1>
        </div>

        <div className="ml-3">
          {/* Channel Info Section */}
          <div className="flex flex-wrap items-center space-x-4">
            <Link to={`/${channelName}`}>
              <img
                src={avatar}
                alt={channelName}
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 border-gray-200 object-cover"
              />
            </Link>
            <div>
            <Link to={`/${channelName}`}>
              <div className="text-md sm:text-lg font-medium text-white">{channelName}</div>
            </Link>
              <div className="text-xs sm:text-xs text-gray-400">{formatNumber(subscribersCount)} followers</div>
            </div>
            {/* <button onClick={handleSubscribeButtion} className="px-3 py-1 sm:px-4 sm:py-2 bg-red-600 text-white rounded-full text-xs sm:text-sm font-medium hover:bg-red-700">
              Subscribe
            </button> */}
            {userId ? (!subscribeDone ? <button onClick={handleSubscribeButtion} className="px-3 py-1 sm:px-4 sm:py-2 bg-red-600 text-white rounded-full text-xs sm:text-sm font-medium">
              Follow
            </button> :  <button onClick={handleSubscribeButtion} className="px-3 py-1 sm:px-4 sm:py-2 bg-[#2d2d2d] text-white rounded-full text-xs sm:text-sm font-medium">
              Following
            </button>) :   <button disabled className="px-3 py-1 sm:px-4 sm:py-2 bg-[#2d2d2d] text-white rounded-full text-xs sm:text-sm font-medium">
              Please log in to follow
            </button>}
            
            {/* {userId? :} */}


          <div className="ml-auto mr-10">

            {/* Like Button Section */}
            <div className="flex flex-wrap items-center space-x-4 sm:space-x-4 md:space-x-4 lg:space-x-4">
                {/* Like Button with Thumbs-Up Icon */}
                {userId ? (
                  <button
                    onClick={handleLike}
                    className="flex items-center sm:text-sm space-x-2 sm:px-4 sm:py-2 px-3 py-1 text-gray-700 rounded-full text-xs font-medium bg-gray-300 hover:bg-gray-400 transition duration-200 ease-in-out"
                  >
                    <span className={"text-gray-700"}> {!findUser?<AiOutlineLike className="text-xl"/> : < AiFillLike  className="text-red-700 text-xl"/>}</span>
                    <div className="text-sm text-gray-700 font-medium">
                      <span className="mr-1 ">{formatNumber(likes)}</span>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="flex items-center sm:text-sm space-x-2 sm:px-4 sm:py-2 px-3 py-1 text-gray-700 rounded-full text-xs font-medium bg-gray-300 hover:bg-gray-400 transition duration-200 ease-in-out"
                  >
                    <span className="text-gray-700"> <AiOutlineLike /></span>
                    <div className="text-sm text-gray-700 font-medium">
                      <span className="mr-1">{formatNumber(likes)}</span>
                    </div>
                  </button>
                )}

                <div>
                   {/* Feedback message after sharing */}
                   {shareMessage && (
                        <div className="absolute top-180 right-35 mt-2 text-green-500 text-sm">
                            {shareMessage}
                        </div>
                    )}

                  {/* Share Button with Share Icon */}
                  <button onClick={handleShare}
                    className="flex items-center space-x-2 sm:px-4 sm:py-2 px-3 py-1 text-gray-700 rounded-full sm:text-sm text-xs font-medium bg-gray-300 hover:bg-gray-400 transition duration-200 ease-in-out"
                  >
                    <FontAwesomeIcon icon={faShare} />
                    <span>Share</span>
                  </button>
                </div>

                  {/* Download Button with Download Icon */}
                  <a href={`/${title}.mp4`} download>
                    <button
                      className="flex items-center space-x-2 sm:px-4 sm:py-2 px-3 py-1 text-gray-700 rounded-full sm:text-sm text-xs font-medium bg-gray-300 hover:bg-gray-400 transition duration-200 ease-in-out"
                    >
                      <FontAwesomeIcon icon={faDownload} />
                      <span>Download</span>
                    </button>
                  </a>


                  {/* Save Button with Save Icon */}
                  {/* <button
                    className="flex items-center space-x-2 sm:px-4 sm:py-2 px-3 py-1 text-gray-700 rounded-full sm:text-sm text-xs  font-medium bg-gray-300 hover:bg-gray-400 transition duration-200 ease-in-out"
                  >
                  <FontAwesomeIcon icon={faBookmark} />
                    <span>Save</span>
                  </button> */}

                  {open && (

                    <div className="fixed inset-0 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
                        <h2 className="text-lg font-semibold mb-4">This video will be deleted permanently, and you will lose all comments and likes. Are you sure you want to proceed?</h2>
                       {!loader && <>
                        <div className="flex justify-center space-x-4">
                          <Button
                            onClick={deleteHandler}
                            className="bg-red-600 text-white rounded-full px-4 py-2 text-sm md:text-base"
                          >
                            Delete
                          </Button>
                        </div>
                        <button
                          onClick={() => setOpen(false)}
                          className="mt-4 text-sm text-gray-500 hover:underline"
                        >
                          Cancel
                        </button>
                        </>}
                        {loader ? <div className="mt-2"><Spinner /> </div>: null}
                      </div>
                    </div>
                  )}
                   {/* Delete Button with Delete Icon */}
                   {userId === userChannelId  && ( <button onClick={openHandler}
                    className="flex items-center space-x-2 sm:px-4 sm:py-2 px-3 py-1 text-gray-700 rounded-full sm:text-sm text-xs  font-medium bg-gray-300 hover:bg-gray-400 transition duration-200 ease-in-out"
                  >
                  <MdDeleteForever className="text-xl"/>
                    <span>Delete</span>
                  </button>)}

                   {/* Edit Button with Edit Icon */}
                  <Link to={`/home/videos/edit/${videoId}`}>
                  {userId === userChannelId  && ( <button
                    className="flex items-center space-x-2 sm:px-4 sm:py-2 px-3 py-1 text-gray-700 rounded-full sm:text-sm text-xs  font-medium bg-gray-300 hover:bg-gray-400 transition duration-200 ease-in-out"
                  >
                  <FaEdit className="text-md"/>
                    <span>Edit</span>
                  </button>)}
                  </Link>
                </div>
              </div>
          </div>

         <div className="bg-[#2d2d2d] rounded-xl mb-5 mr-4">
           {/* Stats Section */}
           <div className="ml-4 pb-3 pt-0.5 mt-2">
           <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm text-white mt-4">
            <div className="flex items-center space-x-2">
              <span>{formatNumber(views)} views</span>
              <span>&bull;</span>
              <span>{timeAgo(uploadTime)}</span>
            </div>
          </div>

          {/* Description Section */}
          <div className="text-xs sm:text-sm text-white ">
          {showFullDescription ? description : truncatedDescription}
            <button
              onClick={toggleDescription}
              className="text-black-500 text-sm mt-2"
            >
              {showFullDescription ? <span className="font-bold">{"Show Less"}</span> : <span className="font-bold">{"Show More"}</span>}
            </button>
          </div>
           </div>
         </div>
        </div>
        {/* Comment Section */}
        <CommentBox className="ml-4 mr-4 flex space-x-2 mb-4" videoId={videoId} userId={userId} formatNumber={formatNumber}/>
      </div>
    </Container>
  );
}

export default VideoPlayCard;
