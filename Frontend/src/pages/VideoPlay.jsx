import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Loader";
import { VideoPlayCard } from "./allpage";
import fetchWithAuth from "../utils/api";
function VideoPlay() {
    let { videoId } = useParams();
    const [videoLink, setVideoLink] = useState(null); // Start with null
    const [error, setError] = useState(null); // Handle errors
     const [loader, setLoader] = useState(true);
     let url = import.meta.env.VITE_API_URL

    useEffect(() => {
        setVideoLink(null);
        const videoDetails = async () => {
            setLoader(true); 
            try {
                let response = await fetchWithAuth(`${url}/api/v1/videos/${videoId}`, {
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch video");
                }
                let result = await response.json();
                //console.log(result);
                
                if (result?.data?.videoFile) {
                    setVideoLink(result.data);
                } else {
                    throw new Error("Invalid video data");
                }
            } catch (err) {
                console.error(err.message);
                setError(err.message);
                // Ensure invalid video links are not set
            } finally {
                setLoader(false); // Set loader to false after fetching
            }
        };

        videoDetails();
    }, [videoId]);
    

    return (
        <>
        <div className="flex flex-col h-screen mt-20">
            <div>
            {loader ? <div className="mt-60"><Spinner /> </div>: null}
                {error ? (
                    <p>Something went wrong.</p>
                ) : videoLink && (
                    
                    <VideoPlayCard videoFile={videoLink.videoFile} 
                    title={videoLink.title} 
                    avatar={videoLink.owner.avatar}
                    description={videoLink.description}
                    channelName={videoLink.owner.username}
                    userChannelId={videoLink.owner._id}
                    views={videoLink.views}
                    uploadTime={videoLink.createdAt}
                    />
                    
                )}
            </div>
        </div>
        </>
    );
}

export default VideoPlay;
