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

    useEffect(() => {
        const historyData = async () => {
            try {
                let response = await fetch("/api/v1/users/history");
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

    if (loading) {
        return <Spinner />;  // Display spinner while loading
    }

    return (
        <>
      <div className="mt-25 font-bold border-b border-gray-700">
      <p className="text-white ml-55 text-4xl pb-5"><FontAwesomeIcon icon={faClockRotateLeft} className="mr-3"/>Watch History</p>
      </div>
        
            <div className="mt-10">
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
                    />
                </Link>
                ))}
            </div>
      
        </>
    );
}

export default History;


