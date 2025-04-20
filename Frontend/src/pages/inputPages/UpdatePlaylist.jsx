// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import Input from "../../components/Input";
// import Button from "../../components/Button";
// import { useNavigate } from "react-router-dom";
// import Spinner from "../../components/Loader";

// function UpdatePlaylist () {
//     const [formData, setFormData] = useState({
//         name: "",
//         description: ""
//     })
//     const {playlistId} = useParams()
//     const navigate = useNavigate()
//     const [loading, setLoading] = useState(false)

//     const inputHandler = (e)=> {
//         const {name, value} = e.target;
        
//         setFormData((prevData)=> ({
//             ...prevData, [name]: value
//         }))
//     }
//     const playlistData = async ()=> {
//         try {
//             const response = await fetch(`/api/v1/playlist/${playlistId}`)
//             const result = await response.json()
            
//             if(response.ok){
//                 setFormData({
//                     name: result?.data?.name,
//                     description: result?.data?.description
//                 })      
//             }
//         } catch (error) {
//             console.log(error.message);
            
//         }
//     }

//     useEffect(()=> {
//         playlistData()
//     }, [playlistId])

//     const dataHandler = async (e)=> {
//         e.preventDefault()

//         const formDataToSend = new FormData();
//         // Add the old thumbnail and video files if they haven't been changed
//         for (const key in formData) {
//           // Only append new files, otherwise use the original ones.
//           if (formData[key]) {
//             formDataToSend.append(key, formData[key]);
            
//           }
//         }
//         setLoading(true)

//        try {
//             const response = await fetch(`/api/v1/playlist/${playlistId}`, {
//                 method: "PATCH",
//                 credentials: "include",
//                 body: formDataToSend
//             })

//             if (!response.ok) {
//                 throw new Error("Upload failed. Please try again.");
//             }

//             setLoading(false)
//             navigate(`/playlist/${playlistId}`)

//        } catch (error) {
//          setLoading(false)
//          console.log(error.message);
         
//        }
//     }

//     //console.log(formData);
    

//     return (
//         <>
           
//             <div className="flex items-center justify-center h-screen">
                
//                 <div className=" p-6 rounded-lg shadow-lg mx-auto">
//                 {/* {error && <p className="text-red-600 mt-4 text-center font-medium">{error}</p>} */}
//                 <h2 className="text-white text-lg font-semibold mb-4">Update Playlist</h2>

//                 <form onSubmit={dataHandler} className="space-y-6">
//                     <div className="flex">
//                         <div className="flex-1">
//                             <Input
//                             onChange={inputHandler}
//                             value={formData?.name}
//                             className="bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
//                             label="Name"
//                             name="name"
//                             type="text"
//                             placeholder="Enter your playlist name"
//                             required
//                             />
//                             <div className="text-white mt-4 mb-1">Description</div>
//                             <textarea
//                             onChange={inputHandler}
//                             value={formData?.description}
//                             className="bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white w-full h-50 p-2"
//                             name="description"
//                             placeholder="Enter your playlist description"
//                             required
//                             ></textarea>
//                         </div>
//                     </div>
        
//                     {loading ? <div className="mt-2"><Spinner /> </div>: null}
//                     <Button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
//                         Update
//                     </Button>
        
//                 </form>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default UpdatePlaylist





import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Spinner from "../../components/Loader";

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
  const url = "https://videotube-mggc.onrender.com" || "http://localhost:8000"

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

//   // Input change handler for file uploads (Thumbnail)
//   const fileHandler = (e) => {
//     const { name, files } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: files[0], // assuming only 1 file is uploaded
//     }));
//   };

  // Fetch existing playlist data
  const playlistData = async () => {
    try {
      const response = await fetch(`${url}/api/v1/playlist/${playlistId}`);
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
      const response = await fetch(`${url}/api/v1/playlist/${playlistId}`, {
        method: "PATCH",
        credentials: "include",
        body: formDataToSend,
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
