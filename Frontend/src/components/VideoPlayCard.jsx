import React from "react";
import Container from "./container/Container";

function VideoPlayCard({
  videoFile,
  title,
  avatar,
  channelName,
  uploadTime,
  subscribers,
  likes,
  views,
  description,
}) {
  return (
    <Container>
      <div className=" w-full h-full object-cover max-w-8xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        
        {/* Video Section */}
        <div className="flex justify-center h-150 bg-black">
          <video
            className="w-full-lg max-h-[300px] sm:max-h-[400px] md:max-h-[500px] lg:max-h-[600px] object-cover"
            src={videoFile}
            controls
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Video Details Section */}
        <div className="p-4">
          
          {/* Title Section */}
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 truncate">
            {title}
          </h1>

          {/* Channel Info Section */}
          <div className="flex flex-wrap items-center space-x-4 mt-4">
            <img
              src={avatar}
              alt={channelName}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-200"
            />
            <div>
              <div className="text-md md:text-lg font-medium text-gray-800">{channelName}</div>
              <div className="text-xs md:text-sm text-gray-600">{subscribers} subscribers</div>
            </div>
            <button className="px-3 py-1 md:px-4 md:py-2 bg-red-600 text-white rounded-full text-xs md:text-sm font-medium hover:bg-red-700">
              Subscribe
            </button>
          </div>

          {/* Stats Section */}
          <div className="flex flex-wrap items-center justify-between text-xs md:text-sm text-gray-500 mt-4">
            <div className="flex items-center space-x-2">
              <span>{views} views</span>
              <span>&bull;</span>
              <span>{uploadTime}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 md:h-5 md:w-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 11l-4 4m0 0l-4-4m4 4V3" />
                </svg>
                <span>{likes}</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mt-4 md:mt-6 text-xs md:text-sm text-gray-700">
            {description}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default VideoPlayCard;
