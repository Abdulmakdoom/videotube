
// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import timeAgo from "../../components/time";
// // import { IoIosAddCircleOutline } from "react-icons/io";
// import Card from "../../components/Card";


// function AddVideoInPlaylist (){
//     const { userId } = useParams();
//     //const [data, setData] = useState();
    
//     const [userVideoData, setUserVideoData] = useState([])
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

  
//     useEffect(() => {
//       const fetchPlaylist = async () => {
//         setUserVideoData([])
//         try {
//         //   let response = await fetch(`/api/v1/playlist/${playlistId}`);
         
//         //   if (!response?.ok) {
//         //     throw new Error('Failed to fetch playlist');
//         //   }
//         //   let result = await response.json();

         
//           const response2 = await fetch(`/api/v1/videos/u?page=1&limit=10&sortBy=views&sortType=desc&userId=${userId}`)
//           let result2 = await response2.json();
//          //console.log(result2.data);
//           setUserVideoData(result2.data)
          
  
  
//           setLoading(false);
//         } catch (error) {
//           setError(error.message);
//           setLoading(false);
//         }
//       };
  
//       fetchPlaylist();
//     }, [userId]);
//     return (
//         <>
//                 {/* Popup add video in playlist */}
//           <div className="mt-20">
//             <div className="bg-[#0A0A0A] p-8 rounded-lg w-4/5 max-w-5xl transform transition-transform shadow-lg">
//               <div className="flex justify-between items-center mb-8">
//                 <h2 className="text-4xl font-semibold text-white">Add Video to Playlist</h2>
//                 {/* <button
//                   onClick={() => setPopupPage(false)}
//                   className="text-gray-600 text-3xl hover:text-gray-900 transition-colors duration-300"
//                   aria-label="Close Popup"
//                 >
//                   &times;
//                 </button> */}
//               </div>
    
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {userVideoData.map((video)=>(
//                   <Card
//                     key={video._id}
//                     title={video.title}
//                     duration={video.duration} 
//                     thumbnail={video.thumbnail} 
//                     ownerAvatar={video.ownerDetails.avatar} 
//                     channelName={video.ownerDetails.username} 
//                     views={video.views} 
//                     uploadDate={timeAgo(video.createdAt)}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>

//         </>
//     )
// }

// export default AddVideoInPlaylist









// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import timeAgo from "../components/time";
// import { IoIosAddCircleOutline } from "react-icons/io";
// // import Card from "../components/Card";


// const PlaylistPage = () => {
//   const { playlistId } = useParams();
//   const [data, setData] = useState();
  
//   // const [userVideoData, setUserVideoData] = useState([])
//   const [playlistData, setPlaylistData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   // const [popupPage, setPopupPage] = useState(false)

//   useEffect(() => {
//     const fetchPlaylist = async () => {
//       // setUserVideoData([])
//       try {
//         let response = await fetch(`/api/v1/playlist/${playlistId}`);
       
//         if (!response?.ok) {
//           throw new Error('Failed to fetch playlist');
//         }
//         let result = await response.json();
//         //console.log(result?.data);
        
//         setPlaylistData(result?.data);
//         setData(result?.data.owner._id)

       
//       //   const response2 = await fetch(`/api/v1/videos/u?page=1&limit=10&sortBy=views&sortType=desc&userId=${result?.data.owner._id}`)
//       //   let result2 = await response2.json();
//       //  //console.log(result2.data);
//       //   setUserVideoData(result2.data)
        


//         setLoading(false);
//       } catch (error) {
//         setError(error.message);
//         setLoading(false);
//       }
//     };

//     fetchPlaylist();
//   }, [playlistId]);


//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   const listArray = playlistData?.videos;
//   //console.log(playlistData);
//   //console.log(listArray);


  

//   return (
//     <>

//     <div className="flex flex-col md:flex-row bg-[#0A0A0A] text-white h-screen p-4 mt-20">
//       {/* Left Side - Playlist Info */}
//       <div className="md:w-1/4 bg-gradient-to-b from-red-800 to-red-900 p-4 rounded-lg">
//         <img
//           src={playlistData?.videos?.[0]?.thumbnail}
//           alt="Playlist Cover"
//           className="object-cover rounded-3xl w-full h-44 p-3"
//         />
//         <h2 className="text-3xl font-bold mt-3 pl-3">{playlistData?.name}</h2>
//         <div className="flex items-center">
       
//         {playlistData?.owner?.avatar && (
//             <img
//             src={playlistData?.owner?.avatar}
//             alt={playlistData?.owner?.username}
//             className="w-8 h-8 object-cover rounded-full mt-2 mr-2 ml-2"
//             />
//         )}
//         <p className="text-sm text-gray-300">by {playlistData?.owner?.username}</p>
//         </div>

//         <p className="text-sm text-gray-300 pl-3 mt-1">
//           Playlist • {playlistData?.videosCount} videos • {playlistData?.totalViews} views
//         </p>
//         <button className="mt-4 bg-white text-black px-4 py-2 rounded-lg w-full font-semibold">
//           ▶ Play all
//         </button>
//       </div>

//       {/* Right Side - Video List */}
//       <div className="md:w-3/4 mt-4 md:mt-0 md:ml-4">
//         <div className="bg-[#212121] rounded-2xl h-40 w-full mb-6">
//           <div className="flex justify-center items-center h-full">
//             <Link to={`/playlist/add/${data}`}>
//             <IoIosAddCircleOutline className="h-20 w-20" />
//             </Link>
//           </div>
//         </div>


//         {listArray.map((video, index) => (
//             <Link to={`/home/videos/${video?._id}`} key={index}>
//           <div className="flex items-center gap-4 mb-4 hover:bg-[#212121] ml-6 hover:rounded-2xl">

//             {/* <img
//               src={video.thumbnail}
//               alt={video.title}
//               className="w-60 h-42 rounded-lg"
//             /> */}
//             <div className="relative rounded-lg w-full sm:w-60 h-40 shadow-lg mb-4 sm:mb-0 sm:mt-0 bg-[#0A0A0A]">
//                 {/* Thumbnail */}
//                 <div className="relative w-full h-full">
//                     <img
//                         src={video?.thumbnail}
//                         alt={video?.title}
//                         className="absolute top-0 left-0 w-full h-full object-cover rounded-md border-none" // Use object-cover to fill the div
//                     />
//                 </div>

//                 {/* Video Duration - Positioned at bottom-right corner */}
//                 <div className="absolute bottom-2 right-2 text-xs text-white bg-black bg-opacity-60 p-1 rounded-md">
//                     {video?.duration}
//                 </div>
//             </div>
           
//             <div className="mb-20">
//               <h3 className="text-lg font-semibold">{video?.title}</h3>
//               <p className="text-sm text-gray-400 mt-2">{video?.owner?.username} • {video?.views} views • {timeAgo(video?.createdAt)}</p>
//               <p className="text-sm text-gray-400 mt-2">{video?.description}</p>
             
//             </div>
//           </div>
//           </Link>
//         ))}
//       </div>

//     </div>
//     </>
//   );
// };

// export default PlaylistPage;