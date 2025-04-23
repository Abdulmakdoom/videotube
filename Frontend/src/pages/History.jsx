import React, { useState, useEffect } from "react";
import { SmallCard, Spinner } from "../components/allComponents"; // Import Spinner
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import fetchWithAuth from "../utils/api";


function History() {
    const [videoData, setVideoData] = useState([]);
    const [loading, setLoading] = useState(false);  // Define loading state
    const userData = useSelector((state) => state.auth.userData);
    const userId = userData?._id;
    let url = import.meta.env.VITE_API_URL

    useEffect(() => {
        const historyData = async () => {
            setLoading(true)
            try {
                let response = await fetchWithAuth(url+"/api/v1/users/history", {
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch video history");
                }
                let result = await response.json();
                setVideoData(result.data);
                setLoading(false);  // Set loading to false after data is fetched
            } catch (error) {
                console.error("Error fetching video history:", error);
                setLoading(false);  // Set loading to false in case of an error
            }
        };

        if (userId) {
            historyData();
        }
    }, [userId]);

    const deleteHistoryHandler = async()=>{
        try {
            let response = await fetchWithAuth(`${url}/api/v1/users/delete-history`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if(response.ok){
                window.location.reload()
            }  
        } catch (error) {
            //console.log(error.message);
            
        }
    }

    return (
        <>
        <div className="mt-25 font-bold border-b border-gray-700 flex flex-wrap items-center justify-between px-4 sm:px-10">
            <p className="text-white text-2xl sm:text-3xl md:text-4xl pb-3 flex items-center pl-25">
                <FontAwesomeIcon icon={faClockRotateLeft} className="mr-2 sm:mr-3" />
                Watch History
            </p>
            <p onClick={deleteHistoryHandler} className="text-white mt-2 sm:mt-0 text-sm sm:text-base cursor-pointer">
                Clear All
            </p>
        </div>

       

            {userData && (
                <>
                    {loading ? (
                    <div className="flex justify-center items-center h-screen">
                        <Spinner />
                    </div>
                    ) : videoData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-screen text-center px-4 pb-50">
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white mb-4">
                        No watch history available
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                        You haven’t watched any videos yet. Start watching to track your history.
                        </p>
                    </div>
                    ) : null}
                </>
            )}

                


            {!userId && (
            <div className="flex flex-col items-center justify-center h-screen text-center px-4">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white mb-4">
                Please log in to view your watch history
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                To see your watch history, please sign in to your account. Track what you’ve watched and continue from where you left off.
                </p>
                <a
                href="/login"
                className="inline-block px-6 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-medium transition duration-200"
                >
                Go to Login
                </a>
            </div>
            )}

        
            {userId && <div className="mt-10 pl-25 pr-5">
                {videoData.map((data) => (
                <Link to={`/home/videos/${data._id}`} key={data._id}>
                    <SmallCard
                          // Added a unique key prop for each item in the list
                        thumbnail={data.thumbnail}
                        title={data.title}
                        avatar={data.owner.avatar}
                        description={data.description}
                        channelName={data.owner.username}  
                        duration={data.duration}
                        views={data.views}
                        uploadTime={data.createdAt}
                        index={data._id}
                        className="mb-3"
                    />
                </Link>
                ))}
            </div>}
      
        </>
    );
}

export default History;


