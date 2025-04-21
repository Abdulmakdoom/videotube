import React, { useState } from "react";
import { CiCamera } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';

function AvatarEdit ({userId, data}) {
    const [avatar, setAvatar] = useState({avatar: null})
    const navigate = useNavigate();
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

                const response = await fetch(url+"/api/v1/users/avatar", {
                method: "PATCH",
                credentials: "include",
                body: formData,
                });

                const data = await response.json();

                if (response.ok) {
                console.log("Avatar updated successfully!", data);
                navigate(0);
                } else {
                console.error("Failed to update avatar:", data.message || "Unknown error");
                }
            } catch (error) {
                console.error("Error uploading avatar:", error.message);
            }
        };

    //console.log(avatar);

    return (
        <>
         {/* Overlay on Hover */}
      {userId === data?._id && 
            <>
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-80 transition-opacity duration-300">
                    <label htmlFor="avatar-upload" className="flex flex-col items-center justify-center text-white hover:scale-110 transition-transform">
                    <CiCamera size={28} className="mb-1" />
                    <span className="text-xs">Edit</span>
                    </label>
                </div>

                <input
                    id="avatar-upload"
                    type="file"
                    name="avatar"
                    //accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange} // make sure to define this function
                />
            </>
            }
        </>
    )
}

export default AvatarEdit;