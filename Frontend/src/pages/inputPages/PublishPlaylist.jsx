import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import fetchWithAuth from "../../utils/api";

function PublishPlaylist (){
    const [formData, setFormData] = useState({name : "", description: ""})
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const userData = useSelector((state) => state.auth.userData);
    const userId = userData?._id;
    let url = import.meta.env.VITE_API_URL

    const inputHandler = (e)=>{
        const {name, value} = e.target;

        setFormData((prevData)=> ({
            ...prevData, [name] : value
        }))

    }

    const formDataHandler = async(e)=> {
        e.preventDefault();

       try {
        const response = await fetchWithAuth(`${url}/api/v1/playlist/`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData)
        })

        const result = await response.json()
            if(!response.ok){
                setError(result.message)
            }
        navigate(`/videos/playlist/${userId}`)
       } catch (error) {
        console.log(error.message);
        
       }

        
    }
    
    return (
        <>

        <div className="flex justify-center items-center min-h-screen bg-[#0A0A0A] py-6 px-4 pl-20">
            <div className="w-full max-w-lg bg-[#212121] rounded-lg p-8 shadow-lg">
                <h2 className="text-3xl font-bold text-white text-center mb-6">Create Playlist</h2>
                {error && <p className="text-red-600 mt-4 text-center font-medium mb-3">{error}</p>}
                <form onSubmit={formDataHandler}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-white text-sm font-medium mb-2">Name</label>
                        <Input 
                            onChange={inputHandler} 
                            name="name" 
                            type="text" 
                            placeholder="Enter playlist name" 
                            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" 
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="description" className="block text-white text-sm font-medium mb-2">Description</label>
                        <textarea
                            onChange={inputHandler}
                            name="description"
                            placeholder="Enter playlist description here..."
                            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        ></textarea>
                    </div>
                    <Button
                        type="submit"
                        className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        Create
                    </Button>
                </form>
            </div>
        </div>

        </>


    )
}

export default PublishPlaylist;