import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Spinner from "../../components/Loader";
import fetchWithAuth from "../../utils/api";

function UpdatePlaylist() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  let url = import.meta.env.VITE_API_URL

    // Word count function
    const getWordCount = (text) => {
        return text.trim().split(/\s+/).length;
      };

  // Input change handler for form fields
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // Fetch existing playlist data
  const playlistData = async () => {
    try {
      const response = await fetchWithAuth(`${url}/api/v1/playlist/${playlistId}`, {
        credentials:"include",
        headers: {
          "Content-Type": "application/json",
      },
      });
      const result = await response.json();

      if (response.ok) {
        setFormData({
          name: result?.data?.name,
          description: result?.data?.description,
        });
      } else {
        throw new Error(result.message || "Error fetching playlist data.");
      }
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    }
  };

  useEffect(() => {
    playlistData();
  }, [playlistId]);

  // Form submit handler
  const dataHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset any previous errors
    setSuccess(false); // Reset success state

    const formDataToSend = new FormData();

    // Add form data to the FormData object
    for (const key in formData) {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      const response = await fetchWithAuth(`${url}/api/v1/playlist/${playlistId}`, {
        method: "PATCH",
        credentials: "include",
        body: formDataToSend,
        headers: {
          "Content-Type": "application/json",
      },
      });

      if (!response.ok) {
        throw new Error("Failed to update playlist.");
      }

      setLoading(false);
      setSuccess(true); // On successful update, show success message
      navigate(`/playlist/${playlistId}`);
    } catch (error) {
      setLoading(false);
      setError(error.message); // On error, display error message
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r pl-20">
        <div className="p-8 rounded-xl shadow-xl bg-[#212121] transform transition-all duration-300  mx-auto w-full max-w-md">
            <h2 className="text-white text-2xl font-bold mb-6 text-center">Update Playlist</h2>

            <form onSubmit={dataHandler} className="space-y-6">
            {/* Playlist Name */}
            <Input
                onChange={inputHandler}
                value={formData?.name}
                className="bg-[#2b2b2b] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white w-full p-3 placeholder-gray-400 transition duration-300 ease-in-out"
                label="Name"
                name="name"
                type="text"
                placeholder="Enter your playlist name"
                required
            />

            {/* Playlist Description */}
            <div className="text-white mt-4 mb-2">Description</div>
            <textarea
                onChange={inputHandler}
                value={formData?.description}
                className="bg-[#2b2b2b] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white w-full h-32 p-3 placeholder-gray-400 resize-none transition duration-300 ease-in-out"
                name="description"
                placeholder="Enter your playlist description"
                required
            ></textarea>

            {/* Word Count Display */}
            <div className="text-gray-400 text-sm mt-2">
                Word Count: {getWordCount(formData.description)} words
            </div>

            {/* Display Loading Spinner */}
            {loading && (
                <div className="mt-4 flex justify-center">
                <Spinner />
                </div>
            )}

            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full py-3 bg-red-800 text-white rounded-md hover:bg-red-600 focus:ring-4 focus:ring-blue-300 transition duration-200"
            >
                Update Playlist
            </Button>

            {/* Success or Error Messages */}
            {error && (
                <p className="text-red-600 mt-4 text-center text-lg animate__animated animate__fadeIn">{error}</p>
            )}
            {success && (
                <p className="text-green-600 mt-4 text-center text-lg animate__animated animate__fadeIn">
                Playlist updated successfully!
                </p>
            )}
            </form>
        </div>
        </div>

  );
}

export default UpdatePlaylist;
