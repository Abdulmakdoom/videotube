import React, { useState, useEffect } from "react";
import Card from "../components/Card"
import { useSelector } from "react-redux";

function Mainpage() {
    let [error, setError] = useState("")
    let [data, setData] = useState([])


    const userData = useSelector((state)=> state.auth.userData)

    let userId = userData?._id;
    // console.log(userId);
    



    useEffect(() => {
        const listData = async () => {
            try {
                const response = await fetch(
                    // If userId is available, fetch personalized data, otherwise fetch general data
                    userId
                        ? `/api/v1/videos/u/${userId}?page=1&limit=10&sortBy=views&sortType=desc`
                        : `/api/v1/videos/u/videos`
                );
                const result = await response.json();
                // console.log(result);
                


                if (!response.ok) {
                    throw new Error(result.message || "Failed to fetch videos");
                }

                // console.log(result.data);
                
                setData(result.data); 
            } catch (err) {
                setError(err.message || "An unexpected error occurred");
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
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Videos</h2>
            
            {error && <p className="text-red-500">{error}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.map((video) => (
                    <Card key={video._id} 
                    title={video.title}
                    duration={video.duration} 
                    thumbnail={video.thumbnail} 
                    ownerAvatar={video.owner.avatar} 
                    channelName={video.channelName}
                    views={video.views} 
                    uploadDate={video.uploadDate} />
                ))}
            </div>
        </div>
    );
}


export default Mainpage;


// function Mainpage() {
//     const [error, setError] = useState("");
//     const [data, setData] = useState([]);

//     const userData = useSelector((state) => state.auth.userData);
//     const userId = userData?._id;  // Optional chaining to prevent errors

//     useEffect(() => {
//         const listData = async () => {
//             try {
//                 const response = await fetch(
//                     // If userId is available, fetch personalized data, otherwise fetch general data
//                     userId
//                         ? `/api/v1/videos/u/${userId}?page=1&limit=10&sortBy=views&sortType=desc`
//                         : `/api/v1/videos/u/videos`
//                 );

//                 const result = await response.json();

//                 if (!response.ok) {
//                     throw new Error(result.message || "Failed to fetch videos");
//                 }

//                 setData(result.data);
//             } catch (err) {
//                 setError(err.message || "An unexpected error occurred");
//             }
//         };

//         // Fetch data when the component is mounted or when userId changes
//         listData();

//         // Cleanup function for component unmount
//         return () => {
//             setError(""); // Clear error on unmount or before new fetch
//             setData([]); // Clear data on unmount or before new fetch
//         };
//     }, [userId]); // Re-run effect when userId changes
