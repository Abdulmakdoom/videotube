import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {Spinner, Card, timeAgo} from '../components/allComponents.js'
import { useSelector } from 'react-redux';
import { FaVideo } from 'react-icons/fa';
import { RiPlayList2Fill } from "react-icons/ri";
import { TbMessageChatbotFilled } from "react-icons/tb";
import Footer from './Footer.jsx';
import AvatarEdit from './inputPages/AvatarEdit.jsx';
import CoverImageEdit from './inputPages/CoverImageEdit.jsx';
import { FaEdit } from "react-icons/fa";
import { FaLock } from 'react-icons/fa';


// Utility function to format the like count
const formatNumber = (number) => {
    if (number >= 1_000_000) {
      return (number / 1_000_000).toFixed(1) + 'M'; // Format as millions
    } else if (number >= 1_000) {
      return (number / 1_000).toFixed(1) + 'K'; // Format as thousands
    }
    return number; // Return the number as is if less than 1000
  };



function ChannelProfile() {
    const [data, setData] = useState({});
    const [buttonPressed, setButtonPressed] = useState(false)
    const [subscribeDone , setSubscrbeDone] = useState(false)
    const [activeTab, setActiveTab] = useState('videos');
    const [videoData, setVideoData] = useState([])
     const [loader, setLoader] = useState(true);
     const [playlistCount, setPlaylistCount] = useState([])
     const [viewsCount, setViewsCount] = useState("")
    
    const { username } = useParams();
    const userData = useSelector((state) => state.auth.userData);
    const userId = userData?._id;
    //console.log(userData);
    

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`/api/v1/users/c/${username}`, {
                method: 'GET',
                credentials: 'include',
            });
            const result = await response.json();
            setData(result.data);
        };

        fetchUser();
    }, [username]);


        const handleSubscribeButtion = async()=> {
            try {
            const response = await fetch(`/api/v1/subscriptions/c/${data?._id}`, {
            method: "POST",
            credentials: 'include',
            })
            let result = await response.json()
            //console.log(result);
            setButtonPressed(result)
                if (!result.success) {
                throw new Error("Failed to fetch video");
                }
            window.location.reload()
            } catch (error) {
            console.error("Error during fetch:", error);
            }
        }

        const fetchLikes = async () => {
            if (!data?._id) {
                //console.error("Channel ID is missing.");
                return; // Prevent the fetch call if there is no valid ID
            }
        
            try {
                const response2 = await fetch(`/api/v1/subscriptions/c/${data._id}`, {
                    method: "GET",
                    credentials: 'include',
                });
                
                const result2 = await response2?.json();
                
                let data1 = result2?.data?.subscribers;
                const match = data1?.find(item => item.subscriber._id === userId);
                let switchColor = match ? true : false;
        
                setSubscrbeDone(switchColor);
        
                if (result2?.success) {
                    //console.log("success");
                } else {
                    console.error("Error fetching likes:", result2?.message);
                }
            } catch (error) {
                console.error("Error during fetch:", error);
            }
        };
        
        useEffect(() => {
            fetchLikes();
        }, [data, buttonPressed]); // Re-run the fetchLikes when `data` changes
        


        const videoHandler = async () => {
            if (!data?._id) {
                // Prevent the fetch call if there is no valid ID
                return;
            }
        
            setVideoData([])
            setLoader(true); // Set loader to true before fetching
        
            try {
                let response = await fetch(`/api/v1/videos/u?page=1&limit=10&sortBy=views&sortType=desc&userId=${data?._id}`);
                let result = await response.json();
        
                // console.log(result);
                
                if (!response.ok) {
                    throw new Error(result.message || "Failed to fetch videos");
                }
        
                setVideoData(result.data);
        
            } catch (error) {
                console.log(error.message);
                // Optionally, set an error state here to show an error message to the user
                // setError(error.message); // example
            } finally {
                setLoader(false); // Always set loader to false, whether success or failure
            }
        }
        
        

        const playListHandler = async()=>{
            if (!data?._id) {
                return; // Prevent the fetch call if there is no valid ID
            }
            let response = await fetch(`/api/v1/playlist/user/${data?._id}`)
            let result = await response.json()
            //console.log(result);
            setPlaylistCount(result)
            
        }


        
        const viewsHandler = async()=> {
            if (!data?._id) {
                return; // Prevent the fetch call if there is no valid ID
            }
            let response = await fetch(`/api/v1/videos/views/${data?._id}`)
            let result = await response.json()
            //console.log(result);
            setViewsCount(result)
        }
        

        useEffect(()=> {
            videoHandler();
            playListHandler()
            viewsHandler()
        }, [data])

        //console.log(videoData);
        //console.log(viewsCount);
        //console.log(playlistCount);

       if (loader) return <Spinner />;

    return (
 <>
        <div className="bg-[#0A0A0A] mt-18 mx-4 sm:mx-6 md:mx-8 lg:mx-20 pl-20">
            
             {/* Loader spinner when loading */}
                {/* {loader ? (
                    <div className="flex justify-center items-center w-full mt-60">
                    <Spinner />
                    </div>
                ) : null} */}
                
                {/* Banner Section */}
                <div className="w-full h-50 relative overflow-hidden rounded-lg shadow-lg mb-6 group">
                {/* Cover Image */}
                <img
                    src={data?.coverImage || '/default-banner.jpg'}
                    alt="Channel Banner"
                    className="w-full h-full object-cover transition-all duration-500 transform group-hover:scale-105 group-hover:opacity-80 "
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                    <CoverImageEdit userId={userId} data={data}/>
                </div>

            
                {/* Profile Details */}
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-4 sm:p-6 bg-[#181818] text-white rounded-lg shadow-lg mb-6">
                    {/* Avatar */}
                   <div className="relative group w-25 h-25 sm:w-28 sm:h-25 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-xl cursor-pointer">
                        <img
                            src={data?.avatar || '/default-avatar.jpg'}
                            alt="User Avatar"
                            className="w-full h-full object-cover"
                        />
                       <AvatarEdit userId={userId} data={data}/>
                    </div>

              
                    {/* Channel Info */}
                    <div className="flex flex-col justify-center text-center sm:text-left">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100">
                            {data?.username}
                            </h1>
                            {userId === data._id && <div className="ml-2 sm:ml-4">
                                <Link
                                    to={`/${username}/password/edit`}
                                    className="inline-flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white border border-gray-600 rounded-full hover:bg-[#272727] transition-colors duration-200"
                                >
                                    <FaLock className="text-white text-xs sm:text-sm" />
                                    Change Password
                                </Link>
                            </div>}

                            {userId === data._id && <div className="ml-4">
                             <Link to={`/${username}/edit`}>
                                <FaEdit className="cursor-pointer" />
                             </Link>
                            </div>}
                        </div>

                        <h3 className="text-sm sm:text-md font-semibold text-gray-400 mt-1">
                            {data?.fullName}
                        </h3>

                        <div className="flex items-center mt-2 space-x-4 sm:space-x-6">
                            <div className="text-sm text-gray-300">
                            {formatNumber(data?.subscribersCount)} followers
                            </div>
                            <div className="text-sm text-gray-300">
                            {formatNumber(data?.channelsSubscribedToCount)} following
                            </div>
                        </div>

                        <p className="text-gray-500 mt-4 text-sm sm:text-md">
                            {data?.bio || 'Welcome to my channel! Here you will find awesome content about technology and tutorials.'}
                        </p>

                        {userData._id !== data._id && userId ? (
                            !subscribeDone ? (
                            <button
                                onClick={handleSubscribeButtion}
                                className="w-25 mt-3 px-3 py-1 sm:px-4 sm:py-2 bg-white text-black rounded-full text-xs sm:text-sm font-medium"
                            >
                                Follow
                            </button>
                            ) : (
                            <button
                                onClick={handleSubscribeButtion}
                                className="w-30 mt-3 px-3 py-1 sm:px-4 sm:py-2 bg-[#505050] text-white rounded-full text-xs sm:text-sm font-medium"
                            >
                                Following
                            </button>
                            )
                        ) : (
                            ""
                        )}
                        </div>

                    
                </div>
            
                {/* Channel Stats Section */}
     
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 bg-[#181818] rounded-lg shadow-lg mb-6 text-white">
                    <div className="flex flex-col items-center justify-center bg-[#2c2c2c] p-4 rounded-lg shadow-md hover:bg-[#3a3a3a] transition-all duration-300">
                        <h3 className="text-xl sm:text-2xl font-semibold">{formatNumber(videoData?.length) || 0}</h3>
                        <p className="text-sm">Videos</p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-[#2c2c2c] p-4 rounded-lg shadow-md hover:bg-[#3a3a3a] transition-all duration-300">
                        <h3 className="text-xl sm:text-2xl font-semibold">{formatNumber(viewsCount?.data?.countDocuments) || 0}</h3>
                        <p className="text-sm">Total Views</p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-[#2c2c2c] p-4 rounded-lg shadow-md hover:bg-[#3a3a3a] transition-all duration-300">
                        <h3 className="text-xl sm:text-2xl font-semibold">{formatNumber(playlistCount?.data?.length) || 0}</h3>
                        <p className="text-sm">Playlists</p>
                    </div>
                </div>

            
                {/* Tabs: Videos, Playlists, About */}
                <div className="bg-[#0A0A0A] p-4 sm:p-6 text-white">
                        <div className="flex justify-around space-x-4 sm:space-x-6 relative">
                            {/* Button for Videos */}
                            <button
                                className={`py-2 px-6 sm:py-3 sm:px-8 rounded-lg text-xs sm:text-sm focus:outline-none transition-all duration-300 
                                ${activeTab === 'videos' ? 'text-white bg-gradient-to-r from-[#FF0000] to-[#FF6A00] border-b-4 border-white' : 'bg-[#2c2c2c] hover:bg-[#3a3a3a]'}`}
                                onClick={() => (setActiveTab('videos'), videoHandler())}
                            >
                                <FaVideo className="inline-block mr-2 mb-1" /> {/* Icon */}
                                Videos
                            </button>
            
                            {/* Button for Playlists */}
                            <Link to={`/${username}/playlist`}>
                            <button
                                className={`py-2 px-6 sm:py-3 sm:px-8 rounded-lg text-xs sm:text-sm focus:outline-none transition-all duration-300 
                                ${activeTab === 'playlists' ? 'text-white bg-gradient-to-r from-[#FF0000] to-[#FF6A00] border-b-4 border-white' : 'bg-[#2c2c2c] hover:bg-[#3a3a3a]'}`}
                                onClick={() => setActiveTab('playlists')}
                            >
                                <RiPlayList2Fill className="inline-block mr-2 text-[16px] mb-1" /> {/* Icon */}
                                Playlists
                            </button>
                            </Link>
            
                            {/* Button for Tweets */}
                            <Link to={`/${username}/post`}>
                            <button
                                className={`py-2 px-6 sm:py-3 sm:px-8 rounded-lg text-xs sm:text-sm focus:outline-none transition-all duration-300 
                                ${activeTab === 'tweets' ? 'text-white bg-gradient-to-r from-[#FF0000] to-[#FF6A00] border-b-4 border-white' : 'bg-[#2c2c2c] hover:bg-[#3a3a3a]'}`}
                                onClick={() => setActiveTab('tweets')}
                            >
                            <TbMessageChatbotFilled className="inline-block text-[20px] mr-1" /> {/* Icon */}
                                Tweets
                            </button>
                            </Link>
                        </div>
                    </div>
            
                    <hr className="border-t-2 border-[#444] mb-6" />
            
                    {/* Videos Content */}
                    <div className="flex flex-col h-screen mt-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 scrollbar-rounded-lg">
                        <main className="flex-grow p-4 flex flex-col items-center justify-start">
                            {loader ? <div className="mt-60"><Spinner /></div> : null}

                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                            {videoData.map((video) => (
                                <Link to={`/home/videos/${video._id}`} key={video._id}>
                                <Card 
                                    title={video.title}
                                    duration={video.duration} 
                                    thumbnail={video.thumbnail} 
                                    ownerAvatar={video.ownerDetails.avatar} 
                                    channelName={video.ownerDetails.username} 
                                    views={formatNumber(video.views)} 
                                    uploadDate={timeAgo(video.createdAt)} 
                                />
                                </Link>
                            ))}
                            
                            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer w-fit flex items-center gap-2 sm:px-8 sm:py-4">
                                <Link to={`/videos/${data?._id}`}>
                                    <span>View More</span>
                                </Link>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>

                            </div>
                        </main>
                   </div>

            </div>

           <div>
           <Footer/>
           </div>
        </>


    );
}

export default ChannelProfile;
