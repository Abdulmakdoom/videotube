import React, { useState } from "react";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PublishPost() {
    const [formData, setFormData] = useState({ content: "" });
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const userData = useSelector((state) => state.auth.userData);
    const userId = userData?._id;
     let url = "http://localhost:8000"

    const inputHandler = (e) => {
        const { name, value } = e.target;
        setFormData({
            [name]: value,
        });
    };

    const formDataHandler = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${url}/api/v1/tweets/`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
        
            const result = await response.json();
            // Check if the response is successful (status in the range 200-299)
            if (!response.ok) {
                throw new Error(result?.message || 'Something went wrong');  // Throw an error if the response is not ok
            }
            navigate(`/posts/${userId}`)
        
            // Handle the success case (if needed)
        } catch (error) {
            console.error('Error:', error.message);  // Log the error message
            setError(error.message);  // Set the error message to be displayed
        }
        
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#0A0A0A] py-6 px-4 pl-20">
            <div className="w-full max-w-lg bg-[#212121] rounded-lg p-8 shadow-lg">
                <h2 className="text-3xl font-bold text-white text-center mb-6">Create Post</h2>
                {error && <p className="text-red-600 mt-4 text-center font-medium mb-3">{error}</p>}
                <form onSubmit={formDataHandler}>
                    <div className="mb-4">
                        <textarea
                            onChange={inputHandler}
                            label="Content"
                            type="text"
                            name="content"
                            className="text-white w-full bg-gray-700 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Write your post here..."
                        ></textarea>
                    </div>
                    <Button
                        type="submit"
                        className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
                    >
                        Create
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default PublishPost;
