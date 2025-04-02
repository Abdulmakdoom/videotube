import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {Spinner, Card, timeAgo} from '../components/allComponents.js'
import { useSelector } from 'react-redux';
import { FaVideo } from 'react-icons/fa';
import { RiPlayList2Fill } from "react-icons/ri";
import { TbMessageChatbotFilled } from "react-icons/tb";



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
            setLoader(true);
            const response = await fetch(`/api/v1/users/c/${username}`, {
                method: 'GET',
                credentials: 'include',
            });
            const result = await response.json();
            setData(result.data);
            setLoader(false);
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
            console.log(result);
            setButtonPressed(result)
            if (!result.success) {
            throw new Error("Failed to fetch video");
        }
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
                    console.log("success");
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
        
        

    

    return (
        <div className="bg-[#0A0A0A] mt-18 mx-4 sm:mx-6 md:mx-8 lg:mx-20">
            
        {loader && (<Spinner/>)}
            
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100">{data?.username}</h1>
            <h3 className="text-sm sm:text-md font-semibold text-gray-400">{data?.fullName}</h3>
            <div className="flex items-center mt-2 space-x-4 sm:space-x-6">
                <div className="text-sm text-gray-300">{data?.subscribersCount} subscribers</div>
                <div className="text-sm text-gray-300">{data?.channelsSubscribedToCount} following</div>
            </div>
            <p className="text-gray-500 mt-4 text-sm sm:text-md">{data?.bio || 'Welcome to my channel! Here you will find awesome content about technology and tutorials.'}</p>
            {/* {userData._id !== data._id && <button className="px-3 py-1 sm:px-4 sm:py-2 w-25 mt-3 bg-white text-black rounded-full text-xs sm:text-sm font-medium">
              Subscribe
            </button>} */}

            {userData._id !== data._id && userId ? (!subscribeDone ? <button onClick={handleSubscribeButtion} className="w-25 mt-3 px-3 py-1 sm:px-4 sm:py-2 bg-white text-black rounded-full text-xs sm:text-sm font-medium">
                        Subscribe
                        </button> :  <button onClick={handleSubscribeButtion} className="w-30 mt-3 px-3 py-1 sm:px-4 sm:py-2 bg-[#505050] text-white rounded-full text-xs sm:text-sm font-medium">
                        Subscribed
                        </button>) : ""}

            {/* Social Links */}
            {/* <div className="mt-4 sm:mt-6">
                {data?.socialLinks?.instagram && (
                    <a
                        href={data?.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline mr-4 text-xs sm:text-sm"
                    >
                        Instagram
                    </a>
                )}
                {data?.socialLinks?.twitter && (
                    <a
                        href={data?.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline mr-4 text-xs sm:text-sm"
                    >
                        Twitter
                    </a>
                )}
                {data?.socialLinks?.facebook && (
                    <a
                        href={data?.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-xs sm:text-sm"
                    >
                        Facebook
                    </a>
                )}
            </div> */}
        </div>
    </div>

    {/* Channel Stats Section */}
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6 bg-[#181818] rounded-lg shadow-lg mb-6 text-white">
        <div className="text-center bg-[#2c2c2c] p-4 rounded-lg shadow-md hover:bg-[#3a3a3a] transition-all duration-300">
            <h3 className="text-xl sm:text-2xl font-semibold">{videoData?.length || 0}</h3>
            <p className="text-sm">Videos</p>
        </div>
        <div className="text-center bg-[#2c2c2c] p-4 rounded-lg shadow-md hover:bg-[#3a3a3a] transition-all duration-300">
            <h3 className="text-xl sm:text-2xl font-semibold">{viewsCount?.data?.[0]?.views || 0}</h3>
            <p className="text-sm">Total Views</p>
        </div>
        <div className="text-center bg-[#2c2c2c] p-4 rounded-lg shadow-md hover:bg-[#3a3a3a] transition-all duration-300">
            <h3 className="text-xl sm:text-2xl font-semibold">{ "" || 0}</h3>
            <p className="text-sm">Total Likes</p>
        </div>
        <div className="text-center bg-[#2c2c2c] p-4 rounded-lg shadow-md hover:bg-[#3a3a3a] transition-all duration-300">
            <h3 className="text-xl sm:text-2xl font-semibold">{playlistCount?.data?.length || 0}</h3>
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
                <button
                    className={`py-2 px-6 sm:py-3 sm:px-8 rounded-lg text-xs sm:text-sm focus:outline-none transition-all duration-300 
                    ${activeTab === 'Tweets' ? 'text-white bg-gradient-to-r from-[#FF0000] to-[#FF6A00] border-b-4 border-white' : 'bg-[#2c2c2c] hover:bg-[#3a3a3a]'}`}
                    onClick={() => setActiveTab('Tweets')}
                >
                   <TbMessageChatbotFilled className="inline-block text-[20px] mr-1" /> {/* Icon */}
                    Tweets
                </button>
            </div>
        </div>

        <hr className="border-t-2 border-[#444] mb-6" />

         {/* Videos Content */}
        <div className="flex flex-col h-screen mt-20">
        
            <main className="flex-grow p-4 flex flex-col items-center justify-start">
                
                {loader ? <div className="mt-60"><Spinner /> </div>: null}
        
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full"> {/* Ensure full width */}
                {videoData.map((video)=> (
                    <Link to={`/home/videos/${video._id}`} key={video._id}>
                        <Card 
                            title={video.title}
                            duration={video.duration} 
                            thumbnail={video.thumbnail} 
                            ownerAvatar={video.ownerDetails.avatar} 
                            channelName={video.ownerDetails.username} 
                            views={video.views} 
                            uploadDate={timeAgo(video.createdAt)} 
                        />
                    </Link>
                ))}
                </div>
            </main>
        </div>

    {/* Channel Content */}
    <div className="p-4 sm:p-6 bg-[#181818] rounded-lg shadow-lg">
        <p className="text-white text-sm sm:text-md">Content Section Goes Here</p>
    </div>
</div>


    );
}

export default ChannelProfile;
