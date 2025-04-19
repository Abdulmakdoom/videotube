
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

function Mainpage() {
    const [error, setError] = useState("");
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(true);
    // const dispatch = useDispatch()

    const userData = useSelector((state) => state.auth.userData);
    // console.log(userData);

    
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
    
    const userId = userData?._id;
    

    useEffect(() => {
        const listData = async () => {
            setLoader(true); // Set loader to true before fetching
            try {
                // const response = await fetchWithAuth(
                //     userId
                //         ? `/api/v1/videos/u/${userId}?sortBy=views&sortType=desc`
                //         : `/api/v1/videos/u/videos`,
                //         {
                //             method: "GET", // The correct place to define the HTTP method
                //             credentials: 'include', // To ensure cookies are sent with the request
                //         }
                // );

                const response = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}/api/v1/videos/u/videos`,
                        {
                            method: "GET", // The correct place to define the HTTP method
                            credentials: 'include', // To ensure cookies are sent with the request
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

        listData();
        
        

        // Cleanup function for component unmount
        return () => {
            setError(""); // Clear error on unmount or before new fetch
            setData([]); // Clear data on unmount or before new fetch
        };
    }, [userId]);
    

    return (
        <div className="flex flex-col h-screen mt-15 pl-20">

            <main className="flex-grow p-4 flex flex-col items-center justify-start">
               
               {loader ? <div className="mt-60"><Spinner /> </div>: null}
          
                {error && <p className="text-red-500">{error}</p>}
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full"> {/* Ensure full width */}
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
                </div>
            </main>
        </div>
    );
}

export default Mainpage;





