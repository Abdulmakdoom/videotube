
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import timeAgo from "../components/time";

const PlaylistPage = () => {
  const { playlistId } = useParams();
  const [playlistData, setPlaylistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        let response = await fetch(`/api/v1/playlist/${playlistId}`);
        if (!response?.ok) {
          throw new Error('Failed to fetch playlist');
        }
        let result = await response.json();
        setPlaylistData(result?.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!playlistData || !playlistData.videos || playlistData.videos.length === 0) {
    return <div>No videos available in this playlist.</div>;
  }

  const listArray = playlistData.videos;
  //console.log(playlistData);
  //console.log(listArray);
  

  return (
    <div className="flex flex-col md:flex-row bg-[#0A0A0A] text-white h-screen p-4 mt-20">
      {/* Left Side - Playlist Info */}
      <div className="md:w-1/4 bg-gradient-to-b from-red-800 to-red-900 p-4 rounded-lg">
        <img
          src={playlistData.videos[0].thumbnail}
          alt="Playlist Cover"
          className="object-cover rounded-3xl w-full h-44 p-3"
        />
        <h2 className="text-3xl font-bold mt-3 pl-3">{playlistData.name}</h2>
        <div className="flex items-center">
       
        {playlistData.owner.avatar && (
            <img
            src={playlistData.owner.avatar}
            alt={playlistData.owner.username}
            className="w-8 h-8 object-cover rounded-full mt-2 mr-2 ml-2"
            />
        )}
        <p className="text-sm text-gray-300">by {playlistData.owner.username}</p>
        </div>

        <p className="text-sm text-gray-300 pl-3 mt-1">
          Playlist • {playlistData.videosCount} videos • {playlistData.totalViews} views
        </p>
        <button className="mt-4 bg-white text-black px-4 py-2 rounded-lg w-full font-semibold">
          ▶ Play all
        </button>
      </div>

      {/* Right Side - Video List */}
      <div className="md:w-3/4 mt-4 md:mt-0 md:ml-4">
        {listArray.map((video, index) => (
            <Link to={`/home/videos/${video._id}`} key={index}>
          <div className="flex items-center gap-4 mb-4 hover:bg-[#212121] ml-6 hover:rounded-2xl">

            {/* <img
              src={video.thumbnail}
              alt={video.title}
              className="w-60 h-42 rounded-lg"
            /> */}
            <div className="relative rounded-lg w-full sm:w-60 h-40 shadow-lg mb-4 sm:mb-0 sm:mt-0 bg-[#0A0A0A]">
                {/* Thumbnail */}
                <div className="relative w-full h-full">
                    <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="absolute top-0 left-0 w-full h-full object-cover rounded-md border-none" // Use object-cover to fill the div
                    />
                </div>

                {/* Video Duration - Positioned at bottom-right corner */}
                <div className="absolute bottom-2 right-2 text-xs text-white bg-black bg-opacity-60 p-1 rounded-md">
                    {video.duration}
                </div>
            </div>
           
            <div className="mb-20">
              <h3 className="text-lg font-semibold">{video.title}</h3>
              <p className="text-sm text-gray-400 mt-2">{video.owner.username} • {video.views} views • {timeAgo(video.createdAt)}</p>
              <p className="text-sm text-gray-400 mt-2">{video.description}</p>
             
            </div>
          </div>
          </Link>
        ))}
      </div>

    </div>
  );
};

export default PlaylistPage;
