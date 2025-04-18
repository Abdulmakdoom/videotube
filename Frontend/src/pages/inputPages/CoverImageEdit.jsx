import React, { useState } from "react";
import { CiCamera } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

function CoverImageEdit ({userId, data}){
    const [coverImage, setCoverImage] = useState({coverImage : null})
    const navigate = useNavigate()

    const handleCoverChange = async (e)=> {
        const file = e.target.files[0]
        if (!file) return;

        setCoverImage((prevData) => ({
            ...prevData,
            coverImage: file,
        }));

        try {
            const formData = new FormData();
            formData.append("coverImage", file)

            const response = await fetch("/api/v1/users/cover-image", {
            method: "PATCH",
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
    }
    return (
        <>
          {/* Edit Overlay */}
            {userId === data?._id &&
                <>
                <label
                htmlFor="cover-upload"
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            >
                <div className="text-white text-center flex flex-col items-center gap-1 hover:scale-105 transition-transform">
                <CiCamera size={30} />
                <span className="text-sm font-medium">Edit Cover</span>
                </div>
            </label>

            {/* Hidden File Input */}
            <input
                id="cover-upload"
                type="file"
                name="coverImage"
                accept="image/*"
                className="hidden"
                onChange={handleCoverChange} // You define this function below
            />
                </>
            }
        </>
    )
}

export default CoverImageEdit