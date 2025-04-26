import React, {useState, useEffect} from "react";
import {Spinner, timeAgo, PlaylistCard} from '../components/allComponents.js'
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import fetchWithAuth from "../utils/api.js";


function OwnerAllPlaylist() {
    const [playlistData, setPlaylistData] = useState([])
     const [loading, setLoading] = useState(true);

    const userData = useSelector((state) => state.auth.userData);
    const userId = userData?._id;
    let url = import.meta.env.VITE_API_URL

    const playListHandler = async () => {
        if (!userId) {
            // Prevent the fetch call if there is no valid ID
            return;
        }
    
        setPlaylistData([])
        setLoading(true); // Set loader to true before fetching
    
        try {
            let response = await fetchWithAuth(`${url}/api/v1/playlist/user/${userId}`, {
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
    
            setPlaylistData(result.data);
    
        } catch (error) {
           // console.log(error.message);
        } finally {
            setLoading(false); // Always set loader to false, whether success or failure
        }
    }

    useEffect(()=> {
        playListHandler()
    }, [userId])
    return (
        <>

         <div className="flex flex-col h-screen mt-20 pl-20">
            {/* Main content */}
            <div className="flex-grow p-4 flex flex-col justify-start">

                {/* Playlists Title */}
                 <div className="relative z-10 mb-10">
                    <h2 className="font-bold text-3xl text-white">Your Playlists</h2>
                </div>
                   {/* Loader spinner when loading */}
                   {loading ? (
                <div className="flex justify-center items-center mt-60">
                    <Spinner />
                </div>
                ) : null}
                {/* Grid layout for playlists */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
                    {playlistData.map((video, index) => (
                        <div key={index} className="w-full">
                            <Link to={`/playlist/${video?._id}`}>
                                <PlaylistCard
                                    thumbnail={video?.videos[0]?.thumbnail}
                                    videoCount={video?.videosCount}
                                    title={video?.name}
                                    updatedAt={timeAgo(video?.updatedAt)}
                                />
                            </Link>
                        </div>
                    ))}
                </div>

            </div>
        </div>

        </>
    )
}

export default OwnerAllPlaylist;