import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {Spinner, PostCard, timeAgo} from '../components/allComponents.js'
import { useSelector } from 'react-redux';
import { FaVideo } from 'react-icons/fa';
import { RiPlayList2Fill } from "react-icons/ri";
import { TbMessageChatbotFilled } from "react-icons/tb";
import Footer from './Footer.jsx';
import { FaEdit } from "react-icons/fa";
import fetchWithAuth from '../utils/api.js';


// Utility function to format the like count
const formatNumber = (number) => {
    if (number >= 1_000_000) {
      return (number / 1_000_000).toFixed(1) + 'M'; // Format as millions
    } else if (number >= 1_000) {
      return (number / 1_000).toFixed(1) + 'K'; // Format as thousands
    }
    return number; // Return the number as is if less than 1000
  };

function PostProfile() {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [buttonPressed, setButtonPressed] = useState(false)
    const [subscribeDone , setSubscrbeDone] = useState(false)
    const [activeTab, setActiveTab] = useState('tweets');
    const [postData, setPostData] = useState([])
     const [loader, setLoader] = useState(true);
    const [videoCount, setVideoCount] = useState([])
     const [viewsCount, setViewsCount] = useState()
    
    const { username } = useParams();
    const userData = useSelector((state) => state.auth.userData);
    const userId = userData?._id;
    //console.log(userData);
    let url = import.meta.env.VITE_API_URL

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            const response = await fetchWithAuth(`${url}/api/v1/users/c/${username}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const result = await response.json();
            setData(result.data);
            setLoading(false);
        };

        fetchUser();
    }, [username]);


        const handleSubscribeButtion = async()=> {
            try {
            const response = await fetchWithAuth(`${url}/api/v1/subscriptions/c/${data?._id}`, {
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
                const response2 = await fetchWithAuth(`${url}/api/v1/subscriptions/c/${data._id}`, {
                    method: "GET",
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json",
                    },
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
        


        const postHandler = async () => {
            if (!data?._id) {
                // Prevent the fetch call if there is no valid ID
                return;
            }
        
            setPostData([])
            setLoader(true); // Set loader to true before fetching
        
            try {
                let response = await fetchWithAuth(`${url}/api/v1/tweets/user/${data?._id}`, {
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                let result = await response.json();
        
                //console.log(result);
                
                if (!response.ok) {
                    throw new Error(result.message || "Failed to fetch tweets");
                }
        
                setPostData(result.data);
        
            } catch (error) {
                console.log(error.message);
                // Optionally, set an error state here to show an error message to the user
                // setError(error.message); // example
            } finally {
                setLoader(false); // Always set loader to false, whether success or failure
            }
        }
        
        

        const viewsHandler = async()=> {
            if (!data?._id) {
                return; // Prevent the fetch call if there is no valid ID
            }
            let response = await fetchWithAuth(`${url}/api/v1/videos/views/${data?._id}`, {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            let result = await response.json()
            //console.log(result);
            setViewsCount(result)
        }
        

        useEffect(()=> {
            postHandler();
            viewsHandler()
        }, [data])


        //console.log(data);

        
        
        const videoHandler = async () => {
                    if (!data?._id) {
                        // Prevent the fetch call if there is no valid ID
                        return;
                    }
                    setVideoCount([])
                    try {
                        let response = await fetchWithAuth(`${url}/api/v1/videos/u?page=1&limit=10&sortBy=views&sortType=desc&userId=${data?._id}`, {
                            credentials: "include",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        });
                        let result = await response.json();
                
                        // console.log(result);
                        
                        if (!response.ok) {
                            throw new Error(result.message || "Failed to fetch videos");
                        }
                
                        setVideoCount(result.data);
                
                    } catch (error) {
                        console.log(error.message);
                        // Optionally, set an error state here to show an error message to the user
                        // setError(error.message); // example
                    }
                }
                useEffect(()=> {
                    videoHandler();
                }, [data])
        
    //console.log(postData);
 
    

    if (loading) return <Spinner />;

    return (
  <>
        <div className="bg-[#0A0A0A] mt-18 mx-4 sm:mx-6 md:mx-8 lg:mx-20 pl-20">
            {/* Banner Section */}
            <div className="w-full h-50 relative overflow-hidden rounded-lg shadow-lg mb-6">
                <img
                    src={data?.coverImage || '/default-banner.jpg'}
                    alt="Channel Banner"
                    className="w-full h-full object-cover transition-all duration-500 transform hover:scale-105 hover:opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black opacity-40"></div>
            </div>

            {/* Profile Details */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-4 sm:p-6 bg-[#181818] text-white rounded-lg shadow-lg mb-6">
                {/* Avatar */}
                <div className="w-25 h-25 sm:w-28 sm:h-25 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-xl">
                    <img
                        src={data?.avatar || '/default-avatar.jpg'}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Channel Info */}
                   <div className="flex flex-col justify-center text-center sm:text-left">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100">
                            {data?.username}
                            </h1>
                            <div className="ml-4">
                            <Link to={`/${username}/edit`}>
                                <FaEdit className="cursor-pointer" />
                            </Link>
                            </div>
                        </div>

                        <h3 className="text-sm sm:text-md font-semibold text-gray-400">
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
                    <h3 className="text-xl sm:text-2xl font-semibold">{formatNumber(videoCount?.length) || 0}</h3>
                    <p className="text-sm">Videos</p>
                </div>
                <div className="flex flex-col items-center justify-center bg-[#2c2c2c] p-4 rounded-lg shadow-md hover:bg-[#3a3a3a] transition-all duration-300">
                    <h3 className="text-xl sm:text-2xl font-semibold">{formatNumber(viewsCount?.data?.countDocuments) || 0}</h3>
                    <p className="text-sm">Total Views</p>
                </div>
                <div className="flex flex-col items-center justify-center bg-[#2c2c2c] p-4 rounded-lg shadow-md hover:bg-[#3a3a3a] transition-all duration-300">
                    <h3 className="text-xl sm:text-2xl font-semibold">{formatNumber(postData?.length) || 0}</h3>
                    <p className="text-sm">Posts</p>
                </div>
            </div>

            {/* Tabs: Videos, Playlists, About */}
            <div className="bg-[#0A0A0A] p-4 sm:p-6 text-white">
                    <div className="flex justify-around space-x-4 sm:space-x-6 relative">
                        {/* Button for Videos */}
                    <Link to={`/${username}`}>
                    <button
                            className={`py-2 px-6 sm:py-3 sm:px-8 rounded-lg text-xs sm:text-sm focus:outline-none transition-all duration-300 
                            ${activeTab === 'videos' ? 'text-white bg-gradient-to-r from-[#FF0000] to-[#FF6A00] border-b-4 border-white' : 'bg-[#2c2c2c] hover:bg-[#3a3a3a]'}`}
                            onClick={() => setActiveTab('videos')}
                        >
                            <FaVideo className="inline-block mr-2 mb-1" /> {/* Icon */}
                            Videos
                        </button>
                    </Link>

                        {/* Button for Playlists */}
                        <Link to={`/${username}/playlist`}>
                        <button
                            className={`py-2 px-6 sm:py-3 sm:px-8 rounded-lg text-xs sm:text-sm focus:outline-none transition-all duration-300 
                            ${activeTab === 'playlists' ? 'text-white bg-gradient-to-r from-[#FF0000] to-[#FF6A00] border-b-4 border-white' : 'bg-[#2c2c2c] hover:bg-[#3a3a3a]'}`}
                            onClick={() => (setActiveTab('playlists'))}
                        >
                            <RiPlayList2Fill className="inline-block mr-2 text-[16px] mb-1" /> {/* Icon */}
                            Playlists
                        </button>
                        </Link>

                        {/* Button for Tweets */}
                        <button
                            className={`py-2 px-6 sm:py-3 sm:px-8 rounded-lg text-xs sm:text-sm focus:outline-none transition-all duration-300 
                            ${activeTab === 'tweets' ? 'text-white bg-gradient-to-r from-[#FF0000] to-[#FF6A00] border-b-4 border-white' : 'bg-[#2c2c2c] hover:bg-[#3a3a3a]'}`}
                            onClick={() => setActiveTab('tweets')}
                        >
                            <TbMessageChatbotFilled className="inline-block text-[20px] mr-2 mb-0 " />
                            Tweets
                        </button>
                    </div>
                </div>

                <hr className="border-t-2 border-[#444] mb-6" />

                {/* Post Content */}
                <div className="flex flex-col h-screen mt-20">
                    {/* Loader spinner when loading */}
                    {loader ? (
                        <div className="flex justify-center items-center mt-60">
                            <Spinner />
                        </div>
                    ) : null}

                    {/* Main content */}
                    <div className="flex-grow p-4 flex flex-col items-start justify-start overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 scrollbar-rounded-lg">
                        <div className="flex flex-col w-full space-y-4">
                            {/* Use flex-col for vertical stacking */}
                            {postData.map((post, index) => (
                                <div key={index} className="flex-shrink-0 w-full">
                                    {/* Each card takes full width */}
                                    <PostCard
                                        avatar={post?.owner?.avatar}
                                        channelName={post?.owner?.username}
                                        content={post?.content}
                                        uploadTime={timeAgo(post?.createdAt)}
                                        postId={post?._id}
                                        postData={postData}
                                        userId={post?.owner?._id}
                                        data={data}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
        </div>
       <Footer/>
  </>

    );
}

export default PostProfile;
