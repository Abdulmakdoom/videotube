import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {Spinner} from '../components/allComponents.js'
import { useSelector } from 'react-redux';

function ChannelProfile() {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const { username } = useParams();
    const userData = useSelector((state) => state.auth.userData);
    //console.log(userData);
    

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            const response = await fetch(`/api/v1/users/c/${username}`, {
                method: 'GET',
                credentials: 'include',
            });
            const result = await response.json();
            setData(result.data);
            setLoading(false);
        };

        fetchUser();
    }, [username]);

    if (loading) return <Spinner />;

    return (
        <div className="bg-[#0A0A0A] mt-18 mx-4 sm:mx-6 md:mx-8 lg:mx-20">
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
            {userData._id !== data._id && <button className="px-3 py-1 sm:px-4 sm:py-2 w-25 mt-3 bg-white text-black rounded-full text-xs sm:text-sm font-medium">
              Subscribe
            </button>}

            {/* Social Links */}
            <div className="mt-4 sm:mt-6">
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
            </div>
        </div>
    </div>

    {/* Channel Stats Section */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 bg-[#181818] rounded-lg shadow-lg mb-6 text-white">
        <div className="text-center bg-[#2c2c2c] p-4 rounded-lg shadow-md hover:bg-[#3a3a3a] transition-all duration-300">
            <h3 className="text-xl sm:text-2xl font-semibold">{data?.videoCount}</h3>
            <p className="text-sm">Videos</p>
        </div>
        <div className="text-center bg-[#2c2c2c] p-4 rounded-lg shadow-md hover:bg-[#3a3a3a] transition-all duration-300">
            <h3 className="text-xl sm:text-2xl font-semibold">{data?.totalViews}</h3>
            <p className="text-sm">Total Views</p>
        </div>
        <div className="text-center bg-[#2c2c2c] p-4 rounded-lg shadow-md hover:bg-[#3a3a3a] transition-all duration-300">
            <h3 className="text-xl sm:text-2xl font-semibold">{data?.playlistsCount}</h3>
            <p className="text-sm">Playlists</p>
        </div>
    </div>

    {/* Tabs: Videos, Playlists, About */}
    <div className="bg-[#0A0A0A] p-4 sm:p-6 text-white mb-6">
        <div className="flex justify-around space-x-4 sm:space-x-6">
            <button className="py-1 px-4 sm:py-2 sm:px-6 bg-[#2c2c2c] rounded-lg hover:bg-[#3a3a3a] transition-all duration-300 focus:outline-none text-xs sm:text-sm">
                Videos
            </button>
            <button className="py-1 px-4 sm:py-2 sm:px-6 bg-[#2c2c2c] rounded-lg hover:bg-[#3a3a3a] transition-all duration-300 focus:outline-none text-xs sm:text-sm">
                Playlists
            </button>
            <button className="py-1 px-4 sm:py-2 sm:px-6 bg-[#2c2c2c] rounded-lg hover:bg-[#3a3a3a] transition-all duration-300 focus:outline-none text-xs sm:text-sm">
                About
            </button>
        </div>
    </div>

    {/* Channel Content */}
    <div className="p-4 sm:p-6 bg-[#181818] rounded-lg shadow-lg">
        <p className="text-white text-sm sm:text-md">Content Section Goes Here</p>
    </div>
</div>


    );
}

export default ChannelProfile;
