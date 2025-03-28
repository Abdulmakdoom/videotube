// import React from 'react';
// import { RiPlayListAddFill } from "react-icons/ri";


// const PlaylistCard = ({ thumbnail, videoCount, title, updatedAt }) => {
//     return (
//       <div className="max-w-sm rounded-xl bg-gray-900 overflow-hidden shadow-xl transform transition-all w-80">
//         {/* Thumbnail with video count badge */}
//         <div className="relative">
//           <img
//             src={thumbnail}
//             alt={title}
//             className="w-full h-56 object-cover rounded-t-xl"
//           />
//           <span className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-lg">
//             {videoCount} Videos
//           </span>
//           <span className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-lg"><RiPlayListAddFill /></span>
         

//         </div>
  
//         <div className="p-2 bg-[#0A0A0A]">
//           {/* Title */}
//           <h3 className="text-2xl font-semibold text-white leading-tight transition duration-200">
//             {title}
//           </h3>
  
//           {/* Updated Time */}
//           <p className="text-sm text-[12px] text-gray-400 mt-1">Updated {updatedAt}</p>
  
//           {/* View Full Playlist Button */}
//           <button className="text-[12px] text-gray-400 font-medium rounded-lg shadow-md transition-all ">
//             View Full Playlist
//           </button>
//         </div>
//       </div>
//     );
//   };
// export default PlaylistCard;




import React from 'react';
import { RiPlayListAddFill } from "react-icons/ri";

const PlaylistCard = ({ thumbnail, videoCount, title, updatedAt }) => {
    return (
        <div className="max-w-xs rounded-xl bg-gray-900 overflow-hidden shadow-xl transform transition-all w-full">
            {/* Thumbnail with video count badge */}
            <div className="relative">
                <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-56 object-cover rounded-t-xl"
                />
                <span className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-lg">
                    {videoCount} Videos
                </span>
                <span className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-lg">
                    <RiPlayListAddFill />
                </span>
            </div>

            <div className="p-2 bg-[#0A0A0A]">
                {/* Title */}
                <h3 className="text-2xl font-semibold text-white leading-tight transition duration-200">
                    {title}
                </h3>

                {/* Updated Time */}
                <p className="text-sm text-[12px] text-gray-400 mt-1">Updated {updatedAt}</p>

                {/* View Full Playlist Button */}
                <button className="text-[12px] text-gray-400 font-medium rounded-lg shadow-md transition-all">
                    View Full Playlist
                </button>
            </div>
        </div>
    );
};

export default PlaylistCard;


