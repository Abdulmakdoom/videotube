
import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Spinner from "../components/Loader";

function Mainpage() {
    const [error, setError] = useState("");
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(true);

    const userData = useSelector((state) => state.auth.userData);
    const userId = userData?._id;

    useEffect(() => {
        const listData = async () => {
            setLoader(true); // Set loader to true before fetching
            try {
                const response = await fetch(
                    userId
                        ? `/api/v1/videos/u/${userId}?page=1&limit=10&sortBy=views&sortType=desc`
                        : `/api/v1/videos/u/videos`
                );

                const result = await response.json();
                // console.log(result);
                

                if (!response.ok) {
                    throw new Error(result.message || "Failed to fetch videos");
                }

                setData(result.data);
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
        <div className="flex flex-col h-screen mt-20">

            <main className="flex-grow p-4 flex flex-col items-center justify-start">
               
               {loader ? <div className="mt-60"><Spinner /> </div>: null}
          
                {error && <p className="text-red-500">{error}</p>}
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full"> {/* Ensure full width */}
                    {data.map((video) => (
                        <Link to={`videos/${video._id}`} key={video._id}>
                            <Card 
                                title={video.title}
                                duration={video.duration} 
                                thumbnail={video.thumbnail} 
                                ownerAvatar={video.owner.avatar} 
                                channelName={video.owner.username}
                                views={video.views} 
                                uploadDate={video.createdAt} 
                            />
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default Mainpage;