import React, { useEffect, useState } from "react";
import Container from "./container/Container";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import fetchWithAuth from "../utils/api";
import CommentBox from "./CommentsBox";

// Utility function to format the like count
const formatNumber = (number) => {
  if (number >= 1_000_000) {
    return (number / 1_000_000).toFixed(1) + 'M'; // Format as millions
  } else if (number >= 1_000) {
    return (number / 1_000).toFixed(1) + 'K'; // Format as thousands
  }
  return number; // Return the number as is if less than 1000
};

function timeAgo(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000); // Get the difference in seconds

  const years = Math.floor(diffInSeconds / (60 * 60 * 24 * 365)); // Calculate years
  const months = Math.floor(diffInSeconds / (60 * 60 * 24 * 30)); // Calculate months
  const days = Math.floor(diffInSeconds / (60 * 60 * 24)); // Calculate days
  const hours = Math.floor(diffInSeconds / (60 * 60)); // Calculate hours
  const minutes = Math.floor(diffInSeconds / 60); // Calculate minutes

  if (diffInSeconds < 0) {
      // For future dates
      const futureDiffInSeconds = Math.abs(diffInSeconds);
      const futureYears = Math.floor(futureDiffInSeconds / (60 * 60 * 24 * 365));
      const futureMonths = Math.floor(futureDiffInSeconds / (60 * 60 * 24 * 30));
      const futureDays = Math.floor(futureDiffInSeconds / (60 * 60 * 24));
      const futureHours = Math.floor(futureDiffInSeconds / (60 * 60));
      const futureMinutes = Math.floor(futureDiffInSeconds / 60);

      if (futureYears > 0) {
          return futureYears === 1 ? "In 1 year" : `${futureYears} years`;
      } else if (futureMonths > 0) {
          return futureMonths === 1 ? "In 1 month" : `${futureMonths} months`;
      } else if (futureDays > 0) {
          return futureDays === 1 ? "In 1 day" : `${futureDays} days`;
      } else if (futureHours > 0) {
          return futureHours === 1 ? "In 1 hour" : `${futureHours} hours`;
      } else if (futureMinutes > 0) {
          return futureMinutes === 1 ? "In 1 minute" : `${futureMinutes} minutes`;
      } else {
          return "In the future"; // For less than a minute future difference
      }
  }

  if (years > 0) {
      return years === 1 ? "1 year ago" : `${years} years ago`;
  } else if (months > 0) {
      return months === 1 ? "1 month ago" : `${months} months ago`;
  } else if (days > 0) {
      return days === 1 ? "1 day ago" : `${days} days ago`;
  } else if (hours > 0) {
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (minutes > 0) {
      return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  } else {
      return "Just now"; // If the difference is less than a minute
  }
}



function VideoPlayCard({
  videoFile,
  title,
  avatar,
  channelName,
  uploadTime,
  views,
  description,
  userChannelId
}) {
    const [likes, setLikes] = useState(0);
    const [subscribersCount, setSubscribersCount] = useState(0)
    let { videoId } = useParams();
    const [hasSeen30, setHasSeen30] = useState(false); 
    const [buttonPressed, setButtonPressed] = useState(false)
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [subscribeDone , setSubscrbeDone] = useState(false)
    let navigate = useNavigate()
    const userData = useSelector((state) => state.auth.userData);

    const userId = userData?._id;
    //console.log(userId);        

  // Fetch the likes count when the component mounts
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response1 = await fetch(`/api/v1/likes/videos/${videoId}`, {
          credentials: 'include',
        });
        const response2 = await fetch(`/api/v1/subscriptions/c/${userChannelId}`, {
          method: "GET",
          credentials: 'include',
        })

        const result = await response1.json();
        const result2 = await response2.json();
        //console.log(result2.data.subscribers);

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
    const response = await fetch(`/api/v1/subscriptions/c/${userChannelId}`, {
      method: "POST",
      credentials: 'include',
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
  const handleVideoProgress = (event) => {
    const videoElement = event.target;
    const currentTime = videoElement.currentTime;
    const duration = videoElement.duration;

    // Check if 30% of the video has been watched
    if (currentTime >= duration * 0.3 && !hasSeen30) {
      setHasSeen30(true); // Set the flag to true so it doesn't trigger again

      // Call the API to increase the view count
      const updateViews = async () => {
        try {
          const response = await fetch(`/api/v1/videos/views/${videoId}`, {
            method: "POST", // Assuming the API uses POST to update views
            credentials: 'include',
          });
          const result = await response.json();
          console.log(result);
          
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
      const response = await fetch(`/api/v1/likes/toggle/v/video/${videoId}`, {
        method: "POST", // Assuming the API uses POST to toggle likes
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setLikes(data.likes); // Update the like count based on the response
      } else {
        console.error("Error toggling like:", data.message);
      }
    } catch (error) {
      console.error("Error during like action:", error);
    }
  };

  // Toggle description visibility
  const toggleDescription = () => {
    setShowFullDescription((prevState) => !prevState);
  };

  // Truncate description if not showing full text
  const truncatedDescription = description.length > 200 ? description.slice(0, 200) + "..." : description;

  return (
    <Container>
      <div className="w-full max-w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden mt-2">
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
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 truncate">
            {title}
          </h1>
        </div>

        <div className="ml-3">
          {/* Channel Info Section */}
          <div className="flex flex-wrap items-center space-x-4">
            <img
              src={avatar}
              alt={channelName}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-2 border-gray-200"
            />
            <div>
              <div className="text-md sm:text-lg font-medium text-gray-800">{channelName}</div>
              <div className="text-xs sm:text-xs text-gray-600">{formatNumber(subscribersCount)} subscribers</div>
            </div>
            {/* <button onClick={handleSubscribeButtion} className="px-3 py-1 sm:px-4 sm:py-2 bg-red-600 text-white rounded-full text-xs sm:text-sm font-medium hover:bg-red-700">
              Subscribe
            </button> */}
            {userId ? (!subscribeDone ? <button onClick={handleSubscribeButtion} className="px-3 py-1 sm:px-4 sm:py-2 bg-red-600 text-white rounded-full text-xs sm:text-sm font-medium">
              Subscribe
            </button> :  <button onClick={handleSubscribeButtion} className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-400 text-white rounded-full text-xs sm:text-sm font-medium">
              Subscribed
            </button>) :   <button disabled className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-400 text-white rounded-full text-xs sm:text-sm font-medium">
              Please log in to subscribe
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
                    <span className={"text-gray-700"}>Like</span>
                    <div className="text-sm text-gray-700 font-medium">
                      <span className="mr-1 text-red-700">{formatNumber(likes)}</span>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="flex items-center sm:text-sm space-x-2 sm:px-4 sm:py-2 px-3 py-1 text-gray-700 rounded-full text-xs font-medium bg-gray-300 hover:bg-gray-400 transition duration-200 ease-in-out"
                  >
                    <span className="text-gray-700">Like</span>
                    <div className="text-sm text-gray-700 font-medium">
                      <span className="mr-1">{formatNumber(likes)}</span>
                    </div>
                  </button>
                )}


                {/* Share Button with Share Icon */}
                <button
                  className="flex items-center space-x-2 sm:px-4 sm:py-2 px-3 py-1 text-gray-700 rounded-full sm:text-sm text-xs font-medium bg-gray-300 hover:bg-gray-400 transition duration-200 ease-in-out"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 15l4-4m0 0l-4-4m4 4H6"
                    />
                  </svg>
                  <span>Share</span>
                </button>

                {/* Download Button with Download Icon */}
                <button
                  className="flex items-center space-x-2 sm:px-4 sm:py-2 px-3 py-1 text-gray-700 rounded-full sm:text-sm text-xs font-medium bg-gray-300 hover:bg-gray-400 transition duration-200 ease-in-out"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v12m0 0l-4-4m4 4l4-4m-4 4h7"
                    />
                  </svg>
                  <span>Download</span>
                </button>

                {/* Save Button with Save Icon */}
                <button
                  className="flex items-center space-x-2 sm:px-4 sm:py-2 px-3 py-1 text-gray-700 rounded-full sm:text-sm text-xs  font-medium bg-gray-300 hover:bg-gray-400 transition duration-200 ease-in-out"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                    />
                  </svg>
                  <span>Save</span>
                </button>
                </div>
              </div>
          </div>

         <div className="bg-gray-200 rounded-xl mb-5 mr-4">
           {/* Stats Section */}
           <div className="ml-4 pb-3 pt-0.5 mt-2">
           <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm text-gray-500 mt-4">
            <div className="flex items-center space-x-2">
              <span>{views} views</span>
              <span>&bull;</span>
              <span>{timeAgo(uploadTime)}</span>
            </div>
          </div>

          {/* Description Section */}
          <div className="text-xs sm:text-sm text-gray-700">
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
