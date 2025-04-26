import React, { useEffect, useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../components/Loader.jsx";
import fetchWithAuth from "../../utils/api.js";

function PublishVideo() {
  const userData = useSelector((state) => state.auth.userData);
  const userId = userData?._id;
  const {videoId} = useParams()
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: null,
    videoFile: null,
  });
  const [error, setError] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoFileName, setVideoFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [oldData, setOldData] = useState("")
  let url = import.meta.env.VITE_API_URL


    // Word count function
    const getWordCount = (text) => {
      return text.trim().split(/\s+/).length;
    };

  const originalData = async(e)=> {
    const response = await fetchWithAuth(`${url}/api/v1/videos/${videoId}`, {
      credentials: "include",
    })
    const result = await response.json()

    //console.log(result);
    setOldData(result)
    if(response.ok) {
        setFormData({
            title: result.data.title,
            description: result.data.description,
            thumbnail: result.data.thumbnail,
            videoFile: null,

        })
    }
    
  }
  useEffect(()=> {
    originalData()
  }, [videoId])

  const inputHandler = (e)=> {
    const { name, type, files } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : e.target.value,
    }));

    if (type === "file") {
      const file = files[0];
      if (name === "thumbnail") {
        setThumbnailPreview(URL.createObjectURL(file));
      } else if (name === "videoFile") {
        setVideoFileName(file.name);
      }
    }
  }
 



  const handleDrop = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        [type]: file,
      }));
      if (type === "thumbnail") {
        setThumbnailPreview(URL.createObjectURL(file));
      } else if (type === "videoFile") {
        setVideoFileName(file.name);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const validateFiles = () => {
    const { thumbnail, videoFile } = formData;
    if (!thumbnail) {
      return "Please select a thumbnail.";
    }
    if (thumbnail.size > 2 * 1024 * 1024) {
      return "Thumbnail file size should not exceed 2MB.";
    }
    if (!videoFile) {
      return "Please select a video file.";
    }
    if (videoFile.size > 100 * 1024 * 1024) {
      return "Video file size should not exceed 100MB.";
    }
    return null;
  };


  const dataHandler = async (e)=> {
    e.preventDefault();
    setError("");
  

    const validationError = validateFiles();
    if (validationError) {
      setError(validationError);
      return;
    }

    // const formDataToSend = new FormData();
    // for (const key in formData) {
    //   formDataToSend.append(key, formData[key]);
    // }

    const formDataToSend = new FormData();
  
  // Add the old thumbnail and video files if they haven't been changed
  for (const key in formData) {
    // Only append new files, otherwise use the original ones.
    if (formData[key]) {
      formDataToSend.append(key, formData[key]);
    }
  }

    //console.log(formDataToSend);
    
    setLoading(true)

    try {
    
      const response = await fetchWithAuth(`${url}/api/v1/videos/${videoId}`, {
        method: "PATCH",
        body: formDataToSend,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Upload failed. Please try again.");
      }

      const reader = response.body.getReader();
      const contentLength = +response.headers.get("Content-Length");

      let receivedLength = 0; // received bytes
      const chunks = []; // array of received binary chunks

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        chunks.push(value);
        receivedLength += value.length;

        // Calculate progress
        setUploadProgress((receivedLength / contentLength) * 100);
      }

    
      setLoading(false)
      
      navigate(`/home/videos/${videoId}`);
    } catch (error) {
        setLoading(false)
      setError(error.message);
    }

  }

   //console.log(formData);
  

  return (
   
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r pl-20">
  <div className="p-8 rounded-xl shadow-xl bg-[#212121] transform transition-all duration-300 mx-auto w-full max-w-4xl mt-20">
    {error && (
      <p className="text-red-600 mt-4 text-center font-medium animate__animated animate__fadeIn">
        {error}
      </p>
    )}
    <h2 className="text-white text-2xl font-bold mb-6 text-center">Update Video</h2>

    <form onSubmit={dataHandler} className="space-y-6">
      <div className="flex flex-wrap gap-6 md:gap-8">
        <div className="flex-1">
          {/* Title Input */}
          <Input
            onChange={inputHandler}
            value={formData?.title}
            className="bg-[#2b2b2b] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white w-full p-3 placeholder-gray-400 transition duration-300 ease-in-out"
            label="Title"
            name="title"
            type="text"
            placeholder="Enter your video title"
            required
          />

          {/* Description Textarea */}
          <div className="text-white mt-4 mb-1">Description</div>
          <textarea
            onChange={inputHandler}
            value={formData?.description}
            className="bg-[#2b2b2b] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white w-full h-32 p-3 placeholder-gray-400 transition duration-300 ease-in-out"
            name="description"
            placeholder="Enter your video description"
            required
          ></textarea>

          {/* Word Count Display */}
          <div className="text-gray-400 text-sm mt-2 ml-1">
            Word Count: {getWordCount(formData.description)} words
          </div>
        </div>

        <div className="flex-1">
          {/* Thumbnail Upload */}
          <div className="flex flex-col mb-4">
            <label className="text-gray-300">Thumbnail</label>
            <div
              className="border-dashed border-2 border-gray-600 p-4 flex flex-col items-center relative transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
              onDrop={(e) => handleDrop(e, "thumbnail")}
              onDragOver={handleDragOver}
            >
              <input
                onChange={inputHandler}
                className="absolute opacity-0 cursor-pointer"
                name="thumbnail"
                type="file"
                accept="image/*"
                id="thumbnail-upload"
              />
              <label
                htmlFor="thumbnail-upload"
                className="cursor-pointer text-gray-400"
              >
                Drag & drop your thumbnail here or click to select
              </label>
              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  className="mt-2 rounded-md w-full max-h-60 max-w-60"
                />
              )}
              <p className="text-gray-500 text-xs mt-1">Max size: 2MB</p>
            </div>
          </div>

          {/* Video File Upload */}
          <div className="flex flex-col mb-4">
            <label className="text-gray-300">Video File</label>
            <div
              className="border-dashed border-2 border-gray-600 p-4 flex flex-col items-center relative transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
              onDrop={(e) => handleDrop(e, "videoFile")}
              onDragOver={handleDragOver}
            >
              <input
                onChange={inputHandler}
                className="absolute opacity-0 cursor-pointer"
                name="videoFile"
                type="file"
                accept="video/*"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="cursor-pointer text-gray-400"
              >
                Drag & drop your video here or click to select
              </label>
              {videoFileName && (
                <p className="mt-2 text-gray-300">{videoFileName}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">Max size: 100MB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Old Thumbnail Preview */}
      <div className="flex justify-center mt-6">
        {oldData && (
          <div className="relative w-full max-w-xs max-h-60">
            <img
              src={oldData?.data?.thumbnail}
              alt="Old Thumbnail Preview"
              className="w-full h-full object-cover rounded-xl shadow-2xl transition-transform transform hover:scale-105 hover:shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-xl opacity-30"></div>
            <div className="absolute inset-0 rounded-xl border-4 border-gradient-to-r from-teal-400 via-blue-500 to-purple-600 opacity-80"></div>
            <div className="absolute bottom-0 left-0 right-0 p-2 text-center text-white font-semibold opacity-80">
              <span className="bg-black bg-opacity-50 px-4 py-2 rounded-full text-sm">
                Old Thumbnail Preview
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="mt-2 flex justify-center">
          <Spinner />
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress > 0 && (
        <div className="flex flex-col mt-4">
          <div className="flex justify-between items-center text-gray-400 text-sm mb-1">
            <span>Upload Progress: {Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full py-3 bg-red-800 text-white rounded-md hover:bg-red-600 focus:ring-4 focus:ring-blue-300 transition duration-200"
      >
        Update
      </Button>
    </form>
  </div>
</div>


  );
}

export default PublishVideo;




