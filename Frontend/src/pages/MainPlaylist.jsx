
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import timeAgo from "../components/time";
import { IoIosAddCircleOutline } from "react-icons/io";
import Spinner from "../components/Loader";
import Button from "../components/Button";
import { useSelector } from "react-redux";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEllipsisVertical} from '@fortawesome/free-solid-svg-icons';
// import Card from "../components/Card";




const PlaylistPage = () => {
  const { playlistId } = useParams();
  const userData = useSelector((state) => state.auth.userData);
  const userId = userData?._id;
  //const [data, setData] = useState();
  
  const [userVideoData, setUserVideoData] = useState([])
  const [removeData, setRemoveData] = useState({})
  const [playlistData, setPlaylistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [error2, setError2] = useState(null);
  const [popupPage, setPopupPage] = useState(false)
  const naviagte = useNavigate()




function formatDuration(seconds) {
  // Ensure we are working with an integer value by truncating the float
  const totalSeconds = Math.floor(seconds);

  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  // Format as "HH:MM:SS" if there's an hour part
  const parts = [];
  if (hrs > 0) parts.push(hrs.toString().padStart(2, '0'));
  parts.push(mins.toString().padStart(2, '0'));
  parts.push(secs.toString().padStart(2, '0'));

  return parts.join(':');
}

  useEffect(() => {
    const fetchPlaylist = async () => {
     
      
      setUserVideoData([])
      try {
        let response = await fetch(`/api/v1/playlist/${playlistId}`);
       
        if (!response?.ok) {
          throw new Error('Failed to fetch playlist');
        }
        let result = await response.json();
        //console.log(result?.data);
        
        setPlaylistData(result?.data);
        // setData(result?.data.owner._id)

        
        const response2 = await fetch(`/api/v1/videos/u?page=1&limit=10&sortBy=views&sortType=desc&userId=${result?.data.owner._id}`)
        let result2 = await response2.json();
       //console.log(result2.data);
        setUserVideoData(result2.data)
        
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId, removeData, popupPage]);


  if (error) {
    return <div>Error: {error}</div>;
  }


  //console.log(playlistData);

  const popupToggle = ()=> {
    setPopupPage(!popupPage)
  }


  const addVideoInPlaylistHandler = async (videoId)=> {
    //console.log(videoId);
    try {
      const response = await fetch(`/api/v1/playlist/add/${videoId}/${playlistId}`, {
        method: "PATCH",
        credentials: "include"
      })
      const result = await response.json()
      //console.log(result);
      if(response?.ok){
       
        setPopupPage(false)
      } else {
        setError2(result?.message)
      }
    } catch (error) {
      setError(error.message);
  
      
    }
    
  }


  const removeVideoInPlaylistHandler = async (videoId)=> {
    //console.log(videoId);

    setRemoveData({})
    try {
      const response = await fetch(`/api/v1/playlist/remove/${videoId}/${playlistId}`, {
        method: "PATCH",
        credentials: "include"
      })
      const result = await response.json()
      console.log(result);
      if(response?.ok){
        //setPopupPage(false)
        setRemoveData(result)
        naviagte(`/playlist/${playlistId}`)
      } else {
        setError2(result?.message)
      }
    } catch (error) {
      console.log(error);
    }
    
  }


  const detetePlayListHandler = async ()=> {
   try {
    const response = await fetch(`/api/v1/playlist/${playlistId}`, {
      method: "DELETE",
      credentials: "include"
    })
    await response.json()
    if (response.ok){
      naviagte(`/${playlistData?.owner?.username}/playlist`)
    }
   } catch (error) {
    console.log(error.message);
   }
  }



  //console.log(userVideoData);
  //console.log(playlistData?.owner?.username);

  // console.log(playlistData?.videos?.[0]?._id)
  

  //console.log(error2);
  
  

  return (
    <>
        {/* Popup add video in playlist */}

        {popupPage && (
          <div
            className="absolute bg-[#0A0A0A] w-full flex items-center justify-center transition-opacity duration-300 ease-out mt-23 z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          >
            <div className="bg-[#0A0A0A] ml-4 sm:ml-8 md:ml-40 lg:ml-85 lg:mr-0 p-8 rounded-lg w-11/12 sm:w-4/5 max-w-5xl transform transition-transform shadow-lg relative overflow-hidden z-50">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-semibold text-white">Add Video to Playlist</h2>

                {error2 && <div className="text-red-600">{error2}</div>}

                <button
                  onClick={() => (setPopupPage(false))}
                  className="text-gray-600 text-2xl sm:text-3xl hover:text-gray-900 transition-colors duration-300"
                  aria-label="Close Popup"
                >
                  &times;
                </button>
              </div>

              {/* {loading ? <div className="mt-60"><Spinner /> </div>: null} */}
              {/* Wrapper for vertical scroll with custom scrollbar */}
              <div className="h-180 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {userVideoData.map((video) => (
                    <div
                      key={video._id}
                      className="relative bg-[#2E2E2E] p-4 sm:p-5 rounded-lg transition-all transform hover:scale-105 hover:shadow-xl group overflow-hidden"
                    >
                      <div className="relative mb-4 group-hover:scale-110 transition-transform duration-300">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-36 sm:h-40 object-cover rounded-lg group-hover:opacity-80 transition-opacity duration-300"
                          loading="lazy"
                        />
                        <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-[10px] transition-opacity duration-300 group-hover:opacity-100">
                          {formatDuration(video.duration)}
                        </div>
                      </div>

                      {/* Video Details */}
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                        {video.title}
                      </h3>
                      <p className="text-gray-400 text-xs sm:text-sm mb-3">{video.ownerDetails.username}</p>
                      <p className="text-gray-500 text-xs sm:text-sm">{video.views} views · {timeAgo(video.createdAt)}</p>

                      {/* Add to Playlist Button */}
                      <button
                        onClick={() => addVideoInPlaylistHandler(video?._id)}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 ease-in-out transform hover:scale-105 w-full relative"
                        aria-label="Add to Playlist"
                      >
                        Add to Playlist
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}


        <div className="flex flex-col md:flex-row bg-[#0A0A0A] text-white h-auto md:h-screen p-4 mt-20">
          {/* Left Side - Playlist Info */}
          <div className="w-full md:w-1/4 bg-gradient-to-b from-red-800 to-red-900 p-4 rounded-lg flex flex-col">
            {/* Adjusting image to be responsive */}
            <img
              src={playlistData?.videos?.[0]?.thumbnail}
              alt="Playlist Cover"
              className="object-cover rounded-3xl w-full h-44 sm:h-48 md:h-44 lg:h-44 p-3"
            />
            <div className="flex justify-between items-start mt-4">
              <h2 className="text-xl sm:text-2xl font-bold mt-3 pl-3">{playlistData?.name}</h2>
              <div className="">
              {userId === playlistData?.owner?._id && <Button onClick={detetePlayListHandler} className="bg-gray-600 mt-2 text-white rounded-full px-3 py-1 text-sm md:text-base">Delete</Button>}
              {userId === playlistData?.owner?._id && 
              <Link to={`/playlist/edit/${playlistId}`}>
                <Button className="bg-gray-600 mt-2 ml-2 text-white rounded-full px-3 py-1 text-sm md:text-base">
                  Edit
                </Button>
              </Link>
              }
              </div>
            </div>
            <div className="flex items-center mt-2">
              {playlistData?.owner?.avatar && (
                <img
                  src={playlistData?.owner?.avatar}
                  alt={playlistData?.owner?.username}
                  className="w-8 h-8 object-cover rounded-full mt-2 mr-2 ml-2"
                />
              )}
              <p className="text-sm text-gray-300">by {playlistData?.owner?.username}</p>
            </div>

            <p className="text-sm text-gray-300 pl-3 mt-1">
              Playlist • {playlistData?.videosCount} videos • {playlistData?.totalViews} views
            </p>
            <Link to={`/home/videos/${playlistData?.videos?.[0]?._id}`}>
            <button className="mt-4 bg-white text-black px-4 py-2 rounded-lg w-full font-semibold text-sm sm:text-base">
              ▶ Play all
            </button>
            </Link>
          </div>

          {/* Right Side - Video List */}
          <div className="w-full md:w-3/4 h-auto overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 mt-4 md:mt-0">
            <div className="mt-4 md:mt-0 md:ml-4">
              {userId === playlistData?.owner?._id &&<div className="bg-[#212121] rounded-2xl h-40 w-full mb-6 relative">
                <div className="flex justify-center items-center h-full">
                  <IoIosAddCircleOutline
                    onClick={popupToggle}
                    className="h-16 w-16 md:h-20 md:w-20 z-10 cursor-pointer hover:text-red-600 transition-colors duration-300"
                  />
                </div>
              </div>}

              {loading ? <div className="mt-60"><Spinner /> </div> : null}

              {playlistData?.videos.map((video, index) => (
                <div
                  key={video?._id}
                  className="flex flex-col sm:flex-row items-start gap-4 hover:bg-[#212121] ml-6 hover:rounded-2xl transition-all duration-300 h-full sm:h-45"
                >
                  <Link to={`/home/videos/${video?._id}`}>
                    <div className="relative rounded-lg w-full sm:w-70 md:w-72 lg:w-80 h-40 shadow-lg sm:mb-0 sm:mt-0 bg-[#0A0A0A]">
                      <div className="relative w-full h-full">
                        <img
                          src={video?.thumbnail}
                          alt={video?.title}
                          className="top-0 left-0 w-106 h-full object-cover rounded-md border-none"
                        />
                      </div>

                      <div className="absolute bottom-2 right-2 text-xs text-white bg-black bg-opacity-60 p-1 rounded-md">
                        {formatDuration(video?.duration)}
                      </div>
                    </div>
                  </Link>

                  <div className="mb-6 px-4 sm:px-8 flex-1">
                    <Link to={`/home/videos/${video?._id}`}>
                      <h3 className="text-lg sm:text-xl font-semibold">{video?.title}</h3>
                      <p className="text-sm text-gray-400 mt-2">{video?.owner?.username} • {video?.views} views • {timeAgo(video?.createdAt)}</p>
                      <p className="text-sm text-gray-400 mt-2">{video?.description}</p>
                    </Link>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex-1"></div>
                      {userId === playlistData?.owner?._id && <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent navigation
                          removeVideoInPlaylistHandler(video?._id); // Call the remove handler
                        }}
                        className="relative inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:rotate-2 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-lg opacity-20"></span>
                        <span className="relative">Remove</span>
                      </button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

    </>
  );
};

export default PlaylistPage;
