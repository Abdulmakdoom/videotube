import React, { useState } from "react";
import { CiCamera } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "../../utils/api";

function CoverImageEdit ({userId, data}){
    const [coverImage, setCoverImage] = useState({coverImage : null})
     const [error, setError] = useState("")
    const navigate = useNavigate()
    let url = import.meta.env.VITE_API_URL

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

            const response = await fetchWithAuth(url+"/api/v1/users/cover-image", {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: formData,
            });

            const data = await response.json();

            if (response.ok) {
            //console.log("Avatar updated successfully!", data);
            navigate(0);
            } else {
                setError("The file could not be uploaded. It may be too large or an unsupported format.")
                setTimeout(()=> {
                   setError("")
                }, 3000)
            //console.error("Failed to update avatar:", data.message || "Unknown error");
            }
        } catch (error) {
            //console.error("Error uploading avatar:", error.message);
        }
    }
    return (
        <>
          {/* Edit Overlay */}
            {userId === data?._id &&
                <>
                {/* Error popup */}
                    {error && (
                    <div className="absolute top-8 right-0 left-2 bg-red-500 text-white text-sm px-3 py-1 rounded-md shadow-lg mt-2 mr-2 z-50 animate-fadeIn">
                        {error}
                    </div>
                )}
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