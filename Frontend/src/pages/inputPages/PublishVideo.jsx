

import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Loader.jsx";

function PublishVideo() {
  const userData = useSelector((state) => state.auth.userData);
  const userId = userData?._id;
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
   let url = "http://localhost:8000" || "https://videotube-e1hm.onrender.com"

  const inputHandler = (e) => {
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
  };

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
      return setError("Please select a thumbnail.");
    }
    if (thumbnail.size > 4 * 1024 * 1024) {
      return setError("Thumbnail file size should not exceed 5MB.");
    }
    if (!videoFile) {
      return setError("Please select a video file.");
    }
    if (videoFile.size > 100 * 1024 * 1024) {
      return setError("Video file size should not exceed 100MB.");
    }
    return null;
  };

  const dataHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true)
    

    const validationError = validateFiles();
    if (validationError) {
      setError(validationError);
      return;
    }

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
    
      const response = await fetch(url+"/api/v1/videos/", {
        method: "POST",
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
      
      navigate(`/videos/${userId}`);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
   
    <div className="flex items-center justify-center h-screen pl-20">
        
      <div className=" p-6 rounded-lg shadow-lg mx-auto">
        {error && <p className="text-red-600 mt-4 text-center font-medium">{error}</p>}
        <h2 className="text-white text-lg font-semibold mb-4">Upload Video</h2>
        <form onSubmit={dataHandler} className="space-y-6">
          <div className="flex">
            <div className="flex-1">
              <Input
                onChange={inputHandler}
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
                    <img src={thumbnailPreview} alt="Thumbnail Preview" className="mt-2 rounded-md w-full h-auto" />
                  )}
                  <p className="text-gray-500 text-xs mt-1">Max size: 5MB</p>
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
          <Button type="submit" className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200">
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






// import React, { useState } from "react";
// import Input from "../../components/Input";
// import Button from "../../components/Button";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// function PublishVideo() {
//   const userData = useSelector((state) => state.auth.userData);
//   const userId = userData?._id;
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     thumbnail: null,
//     videoFile: null,
//   });
//   const [error, setError] = useState("");
//   const [thumbnailPreview, setThumbnailPreview] = useState(null);
//   const [videoFileName, setVideoFileName] = useState("");
//   const [uploadProgress, setUploadProgress] = useState(0);

//   const inputHandler = (e) => {
//     const { name, type, files } = e.target;

//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: type === "file" ? files[0] : e.target.value,
//     }));

//     if (type === "file") {
//       const file = files[0];
//       if (name === "thumbnail") {
//         setThumbnailPreview(URL.createObjectURL(file));
//       } else if (name === "videoFile") {
//         setVideoFileName(file.name);
//       }
//     }
//   };

//   const handleDrop = (e, type) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     if (file) {
//       setFormData((prevData) => ({
//         ...prevData,
//         [type]: file,
//       }));
//       if (type === "thumbnail") {
//         setThumbnailPreview(URL.createObjectURL(file));
//       } else if (type === "videoFile") {
//         setVideoFileName(file.name);
//       }
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   const validateFiles = () => {
//     const { thumbnail, videoFile } = formData;
//     if (!thumbnail) {
//       return "Please select a thumbnail.";
//     }
//     if (thumbnail.size > 2 * 1024 * 1024) {
//       return "Thumbnail file size should not exceed 2MB.";
//     }
//     if (!videoFile) {
//       return "Please select a video file.";
//     }
//     if (videoFile.size > 100 * 1024 * 1024) {
//       return "Video file size should not exceed 100MB.";
//     }
//     return null;
//   };

//   const dataHandler = (e) => {
//     e.preventDefault();
//     setError("");

//     const validationError = validateFiles();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     const formDataToSend = new FormData();
//     for (const key in formData) {
//       formDataToSend.append(key, formData[key]);
//     }

//     const xhr = new XMLHttpRequest();
//     xhr.open("POST", "/api/v1/videos/", true);
//     xhr.withCredentials = true; // Include credentials if needed

//     // Monitor upload progress
//     xhr.upload.onprogress = (event) => {
//       if (event.lengthComputable) {
//         const percentComplete = (event.loaded / event.total) * 100;
//         setUploadProgress(percentComplete);
//       }
//     };

//     // Handle response
//     xhr.onload = () => {
//       if (xhr.status >= 200 && xhr.status < 300) {
//         alert("Upload successful");
//         navigate(`/videos/${userId}`);
//       } else {
//         setError("Upload failed. Please try again.");
//       }
//     };

//     // Handle error
//     xhr.onerror = () => {
//       setError("Upload failed. Please try again.");
//     };

//     // Send the form data
//     xhr.send(formDataToSend);
//   };

//   return (
//     <div className="upload-background mt-20">
//       <div className="upload-container p-6 rounded-lg shadow-lg max-w-lg mx-auto">
//         {error && <p className="text-red-600 mt-4 text-center font-medium">{error}</p>}
//         <h2 className="text-white text-lg font-semibold mb-4">Upload Video</h2>
//         <form onSubmit={dataHandler} className="space-y-6">
//           <Input
//             onChange={inputHandler}
//             className="bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
//             label="Title"
//             name="title"
//             type="text"
//             placeholder="Enter your video title"
//             required
//           />
//           <Input
//             onChange={inputHandler}
//             className="bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
//             label="Description"
//             name="description"
//             type="text"
//             placeholder="Enter your video description"
//             required
//           />

//           <div className="flex flex-col">
//             <label className="text-gray-300">Thumbnail</label>
//             <div
//               className="border-dashed border-2 border-gray-600 p-4 flex flex-col items-center"
//               onDrop={(e) => handleDrop(e, "thumbnail")}
//               onDragOver={handleDragOver}
//             >
//               <input
//                 onChange={inputHandler}
//                 className="absolute opacity-0 cursor-pointer"
//                 name="thumbnail"
//                 type="file"
//                 accept="image/*"
//                 id="thumbnail-upload"
//               />
//               <label htmlFor="thumbnail-upload" className="cursor-pointer text-gray-400">
//                 Drag & drop your thumbnail here or click to select
//               </label>
//               {thumbnailPreview && (
//                 <img src={thumbnailPreview} alt="Thumbnail Preview" className="mt-2 rounded-md w-full h-auto" />
//               )}
//               <p className="text-gray-500 text-xs mt-1">Max size: 2MB</p>
//             </div>
//           </div>

//           <div className="flex flex-col">
//             <label className="text-gray-300">Video File</label>
//             <div
//               className="border-dashed border-2 border-gray-600 p-4 flex flex-col items-center"
//               onDrop={(e) => handleDrop(e, "videoFile")}
//               onDragOver={handleDragOver}
//             >
//               <input
//                 onChange={inputHandler}
//                 className="absolute opacity-0 cursor-pointer"
//                 name="videoFile"
//                 type="file"
//                 accept="video/*"
//                 id="video-upload"
//               />
//               <label htmlFor="video-upload" className="cursor-pointer text-gray-400">
//                 Drag & drop your video here or click to select
//               </label>
//               {videoFileName && (
//                 <p className="mt-2 text-gray-300">{videoFileName}</p>
//               )}
//               <p className="text-gray-500 text-xs mt-1">Max size: 100MB</p>
//             </div>
//           </div>

//           <Button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
//             Upload
//           </Button>

//           {uploadProgress > 0 && (
//             <div className="flex flex-col mt-4">
//               <div className="flex justify-between items-center text-gray-400 text-sm mb-1">
//                 <span>Upload Progress: {Math.round(uploadProgress)}%</span>
//               </div>
//               <div className="w-full bg-gray-700 rounded-full h-2">
//                 <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${uploadProgress}%` }} />
//               </div>
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }

// export default PublishVideo;

