// import React, { useState, useEffect } from "react";
// import Card from "../components/Card"
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";

// function Mainpage() {
//     let [error, setError] = useState("")
//     let [data, setData] = useState([])
//     const [loader, setLoader] = useState(true)


//     const userData = useSelector((state)=> state.auth.userData)

//     let userId = userData?._id;
//     // console.log(userId);
//     useEffect(() => {
//         const listData = async () => {
//             try {
//                 const response = await fetch(
//                     // If userId is available, fetch personalized data, otherwise fetch general data
//                     userId
//                         ? `/api/v1/videos/u/${userId}?page=1&limit=10&sortBy=views&sortType=desc`
//                         : `/api/v1/videos/u/videos`
//                 );
//                 setLoader(false)
//                 const result = await response.json();
//                 // console.log(result);
                


//                 if (!response.ok) {
//                     throw new Error(result.message || "Failed to fetch videos");
//                 }

//                 // console.log(result.data);
                
//                 setData(result.data); 
//             } catch (err) {
//                 setError(err.message || "An unexpected error occurred");
//             }
//         };

//         listData();

//        // Cleanup function for component unmount
//         return () => {
//             setError(""); // Clear error on unmount or before new fetch
//             setData([]); // Clear data on unmount or before new fetch
//         };
//     }, [userId]);

//     return (
//         <div className="p-4">
//             <h2 className="text-2xl font-bold mb-4">Videos</h2>
//             {loader ? <h1>Loading...</h1> : <>{children}</>}
//             {error && <p className="text-red-500">{error}</p>}
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {data.map((video) => (
//                    <Link to={`video/${video._id}`}>
//                      <Card key={video._id} 
//                     title={video.title}
//                     duration={video.duration} 
//                     thumbnail={video.thumbnail} 
//                     ownerAvatar={video.owner.avatar} 
//                     channelName={video.channelName}
//                     views={video.views} 
//                     uploadDate={video.uploadDate} />
//                    </Link>
//                 ))}
//             </div>
//         </div>
//     );
// }


// export default Mainpage;


import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Spinner = () => {
    return (
        <div className="flex justify-center items-center">
            <div className="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
        </div>
    );
};

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
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full"> {/* Ensure full width */}
                    {data.map((video) => (
                        <Link to={`video/${video._id}`} key={video._id}>
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