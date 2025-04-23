import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { restoreUser } from "../store/authSlice";
import fetchWithAuth from "../utils/api";
// import Cookies from "js-cookie"; 
import {Card, Spinner, timeAgo} from "../components/allComponents.js"

// Utility function to format the like count
const formatNumber = (number) => {
    if (number >= 1_000_000) {
      return (number / 1_000_000).toFixed(1) + 'M'; // Format as millions
    } else if (number >= 1_000) {
      return (number / 1_000).toFixed(1) + 'K'; // Format as thousands
    }
    return number; // Return the number as is if less than 1000
  };

function Subscribers() {
    const [error, setError] = useState("");
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(false);
    // const dispatch = useDispatch()

    const userData = useSelector((state) => state.auth.userData);
    // console.log(userData);
    const userId = userData?._id;
    let url = import.meta.env.VITE_API_URL

    
    // const accessToken = Cookies.get("accessToken"); 
    // console.log(accessToken);
    
    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         if (!userData && accessToken) {
    //             try {
    //                 const response = await fetch("/api/v1/users/login", {
    //                     method: "GET",
    //                     credentials: "include",
    //                     headers: {
    //                         "Authorization": `Bearer ${accessToken}`, // Send token
    //                         "Content-Type": "application/json"
    //                     }
    //                 });

    //                 if (!response.ok) {
    //                     throw new Error("Failed to fetch user data");
    //                 }

    //                 const result = await response.json();
    //                 console.log(result);
                    
    //                // dispatch(restoreUser(result.user)); // Store user in Redux
    //             } catch (err) {
    //                 console.error("Error fetching user data:", err);
    //             }
    //         }
    //     };

    //     fetchUserData();
    // }, [accessToken, dispatch, userData]);
    // console.log(userData);
    

    useEffect(() => {
        const listData = async () => {
            setLoader(true); // Set loader to true before fetching
            try {
                const response = await fetchWithAuth( `${url}/api/v1/videos/u/${userId}?sortBy=views&sortType=desc`,
                        {
                            method: "GET", // The correct place to define the HTTP method
                            credentials: 'include', // To ensure cookies are sent with the request
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || "Failed to fetch videos");
                }

                setData(result.data); // Set the data after successful fetch
            } catch (err) {
                setError(err.message || "An unexpected error occurred");
            } finally {
                setLoader(false); // Set loader to false after fetching
            }
        };

        userId && listData();
        
        

        // Cleanup function for component unmount
        return () => {
            setError(""); // Clear error on unmount or before new fetch
            setData([]); // Clear data on unmount or before new fetch
        };
    }, [userId]);
    

    return (
        <div className="flex flex-col h-screen mt-20 pl-20">

            <main className="flex-grow p-4 flex flex-col items-center justify-start">
               
              
          
                {error && <p className="text-red-500">{error}</p>}

                {userData && (
                    <>
                        {loader ? (
                        <div className="flex justify-center items-center h-screen">
                            <Spinner />
                        </div>
                        ) : data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-screen text-center px-4 pb-50">
                            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white mb-4">
                            No followed videos available
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                            You are not following any creators or they haven’t uploaded new videos yet.
                            Follow creators to discover and enjoy fresh content.
                            </p>
                        </div>
                        ) : null}
                    </>
                )}

                {!userId && (
                    <div className="flex flex-col items-center justify-center h-screen text-center px-4 pb-50">
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white mb-4">
                        Please log in to view followed creators' videos
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                        Sign in to see the latest videos from creators you follow and never miss an update.
                        </p>
                        <a
                        href="/login"
                        className="inline-block px-6 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-medium transition duration-200"
                        >
                        Go to Login
                        </a>
                    </div>
                )}

                
                {userId && <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full"> {/* Ensure full width */}
                    {data.map((video) => (
                        <Link to={`/home/videos/${video._id}`} key={video._id}>
                            <Card 
                                title={video.title}
                                duration={video.duration} 
                                thumbnail={video.thumbnail} 
                                ownerAvatar={video.owner.avatar} 
                                channelName={video.owner.username} 
                                views={formatNumber(video.views)} 
                                uploadDate={timeAgo(video.createdAt)} 
                            />
                        </Link>
                    ))}
                </div>}
            </main>
        </div>
    );
}

export default Subscribers;
