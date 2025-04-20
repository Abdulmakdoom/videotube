import React, { useState, useEffect } from "react";
import { SmallCard, Spinner } from "../components/allComponents"; // Import Spinner
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';


function History() {
    const [videoData, setVideoData] = useState([]);
    const [loading, setLoading] = useState(true);  // Define loading state
    const userData = useSelector((state) => state.auth.userData);
    const userId = userData?._id;
     const url = "https://videotube-mggc.onrender.com" || "http://localhost:8000"

    useEffect(() => {
        const historyData = async () => {
            try {
                let response = await fetch("${}/api/v1/users/history");
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
            let response = await fetch(`/api/v1/users/delete-history`, {
                method: "DELETE",
                credentials: "include"
            })

            if(response.ok){
                window.location.reload()
            }  
        } catch (error) {
            console.log(error.message);
            
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

      {loading ? (
                <div className="flex justify-center items-center mt-60">
                    <Spinner />
                </div>
            ) : null}
        
            <div className="mt-10 pl-25 pr-5">
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
            </div>
      
        </>
    );
}

export default History;


