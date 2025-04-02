import React, { useEffect, useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../components/Loader.jsx";

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
//   const [oldData, setOldData] = useState("")

  const originalData = async(e)=> {
    const response = await fetch(`/api/v1/videos/${videoId}`)
    const result = await response.json()

    console.log(result);
    // setOldData(result)
    if(response.ok) {
        setFormData({
            title: result.data.title,
            description: result.data.description,
            thumbnail: null,
            videoFile: null,

        })

        // Set preview for thumbnail if it exists
      if (result.data.thumbnail) {
        setThumbnailPreview(result.data.thumbnail); // Assuming 'thumbnail' is a URL
      }

      // Set preview for video file if it exists
      if (result.data.videoFile) {
        setVideoFileName(result.data.videoFile); // Assuming 'videoFile' is a URL or filename
      }
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
    } else if (key === "thumbnail" && thumbnailPreview) {
      // If thumbnail was not updated, use the old one
      formDataToSend.append(key, thumbnailPreview);
    } else if (key === "videoFile" && videoFileName) {
      // If video file was not updated, use the old one
      formDataToSend.append(key, videoFileName);
    }
  }

    console.log(formDataToSend);
    
    setLoading(true)

    try {
    
      const response = await fetch(`/api/v1/videos/${videoId}`, {
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

   console.log(formData);
  

  return (
   
    <div className="flex items-center justify-center h-screen">
        
      <div className=" p-6 rounded-lg shadow-lg mx-auto">
        {error && <p className="text-red-600 mt-4 text-center font-medium">{error}</p>}
        <h2 className="text-white text-lg font-semibold mb-4">Upload Video</h2>
        <form onSubmit={dataHandler} className="space-y-6">
          <div className="flex">
            <div className="flex-1">
              <Input
                onChange={inputHandler}
                value={formData?.title}
                className="bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                label="Title"
                name="title"
                type="text"
                placeholder="Enter your video title"
                required
              />
              <div className="text-white mt-4 mb-1">Description</div>
              <textarea
                onChange={inputHandler}
                value={formData?.description}
                className="bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white w-full h-50 p-2"
                name="description"
                placeholder="Enter your video description"
                required
              ></textarea>
            </div>

            <div className="flex-1 ml-6">
              <div className="flex flex-col mb-4">
                <label className="text-gray-300">Thumbnail</label>
                <div
                  className="border-dashed border-2 border-gray-600 p-4 flex flex-col items-center"
                  onDrop={(e) => handleDrop(e, "thumbnail")}
                  onDragOver={handleDragOver}
                >
                  <input
                    //value={formData?.thumbnail}
                    onChange={inputHandler}
                    className="absolute opacity-0 cursor-pointer"
                    name="thumbnail"
                    type="file"
                    accept="image/*"
                    id="thumbnail-upload"
                  />
                  <label htmlFor="thumbnail-upload" className="cursor-pointer text-gray-400">
                    Drag & drop your thumbnail here or click to select
                  </label>
                  {thumbnailPreview && (
                    <img src={thumbnailPreview} alt="Thumbnail Preview" className="mt-2 rounded-md w-full max-h-60 max-w-60" />
                  )}
                  <p className="text-gray-500 text-xs mt-1">Max size: 2MB</p>
                </div>
              </div>

              <div className="flex flex-col mb-4">
                <label className="text-gray-300">Video File</label>
                <div
                  className="border-dashed border-2 border-gray-600 p-4 flex flex-col items-center"
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
                  <label htmlFor="video-upload" className="cursor-pointer text-gray-400">
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

          {loading ? <div className="mt-2"><Spinner /> </div>: null}
          <Button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
            Upload
          </Button>

          {uploadProgress > 0 && (
            <div className="flex flex-col mt-4">
              <div className="flex justify-between items-center text-gray-400 text-sm mb-1">
                <span>Upload Progress: {Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default PublishVideo;




