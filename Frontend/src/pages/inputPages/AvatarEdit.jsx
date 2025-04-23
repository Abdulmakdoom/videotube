import React, { useState } from "react";
import { CiCamera } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import fetchWithAuth from "../../utils/api";



function AvatarEdit ({userId, data}) {
    const [avatar, setAvatar] = useState({avatar: null})
    const navigate = useNavigate();
    const [error, setError] = useState("")
    let url = import.meta.env.VITE_API_URL
    
        const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Optional: update local preview state
        setAvatar((prevData) => ({
            ...prevData,
            avatar: file,
        }));

            try {
                const formData = new FormData();
                formData.append("avatar", file);

                const response = await fetchWithAuth(url+"/api/v1/users/avatar", {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: formData,
                
                });

                await response.json();

                if (response.ok) {
                navigate(0);
                }

                setError("It may be too large")
                setTimeout(()=> {
                   setError("")
                }, 3000)

            } catch (error) {
               
            }
        };



    return (
        <>
        
         {/* Overlay on Hover */}
         {userId === data?._id && (
  <>
    {/* Error popup */}
    {error && (
      <div className="absolute top-8 right-0 left-2 bg-red-500 text-white text-sm px-3 py-1 rounded-md shadow-lg mt-2 mr-2 z-50 animate-fadeIn">
        {error}
      </div>
    )}

    {/* Avatar hover overlay */}
    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-80 transition-opacity duration-300">
      <label
        htmlFor="avatar-upload"
        className="flex flex-col items-center justify-center text-white hover:scale-110 transition-transform"
      >
        <CiCamera size={28} className="mb-1" />
        <span className="text-xs">Edit</span>
      </label>
    </div>

    {/* Hidden file input */}
    <input
      id="avatar-upload"
      type="file"
      name="avatar"
      className="hidden"
      onChange={handleAvatarChange}
    />
  </>
)}



        </>
    )
}


export default AvatarEdit