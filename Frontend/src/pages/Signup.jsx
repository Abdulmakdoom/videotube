
import React, { useState } from "react";
import Button from "../components/Button";
import "../../public/signup.css"
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "../utils/api";

function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        username: "",
        password: "",
        avatar: null,
        coverImage: null,
    });

    let url = import.meta.env.VITE_API_URL
    // Input handler to manage file input changes
    const inputHandler = (e) => {
        const { name, value, type, files } = e.target;

        // Update the formData state based on the input type (file or text)
        setFormData((prevData) => ({
        ...prevData,
        [name]: type === 'file' ? files[0] : value, // Store the file or the text value
        }));

        // If it's a file input, update the corresponding file name in the DOM
        if (type === 'file') {
        const fileName = files[0] ? files[0].name : 'No file chosen';
        document.getElementById(`file-name-${name}`).textContent = fileName;
        }
    };    

    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");

        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        // Validate if required fields are filled
        if (!formData.fullName || !formData.email || !formData.username || !formData.password || !formData.avatar || !formData.coverImage) {
            setError("All fields are required.");
            return;
        }

        try {
            const response = await fetchWithAuth(url+"/api/v1/users/register", {
                method: "POST",
                credentials: 'include',
                body: formDataToSend,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong!");
            }

            alert("Account created successfully!");
            navigate("/login")
        } catch (error) {
            setError(error.message);        
        }
    };

    return (
        <section>
        {/* Span elements for styling */}
        {[...Array(150)].map((_, index) => (
        <span key={index}></span>
        ))}

        <div className="signin1 ">
            <div className="content1 h-[600px] ">
                <h2 className="text-red-700">Sign In</h2>
                {error && <p className="text-red-600 mt-4 text-center font-medium">{error}</p>}
                <form className="form" onSubmit={handleCreate}>
                        <div className="flex">
                            <div className="largeBox1">
                                <div className="inputBox box1">
                                    <input label="Full Name" type="text" name="fullName" onChange={inputHandler} required />
                                    <i>Full Name</i>
                                </div>
                                <div className="inputBox box2">
                                    <input label="Email" type="email" name="email" onChange={inputHandler} required />
                                    <i>Email</i>
                                </div>
                                    <div className="inputBox box3">
                                    <input label="Username" type="text" name="username" onChange={inputHandler} required />
                                    <i>Username</i>
                                </div>
                            </div>
                            <div className="largeBox2">
                                <div className="inputBox box4">
                                    <input label="Password" type="password" name="password" onChange={inputHandler} required />
                                    <i>Password</i>
                                </div>
                                {/* Avatar Input */}
                                <div className="inputBox box5">
                                    <input
                                    type="file"
                                    name="avatar"
                                    id="avatarInput"
                                    onChange={inputHandler}
                                    required
                                    className="hidden"
                                    />
                                    {/* Custom label for avatar input */}
                                    <label
                                    htmlFor="avatarInput"
                                    className="cursor-pointer inline-block px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                    >
                                    Choose Avatar
                                    </label>
                                    {/* Display file name for avatar */}
                                    <div id="file-name-avatar" className="mt-2 text-gray-600 italic">No file chosen</div>
                                </div>

                                {/* Cover Image Input */}
                                <div className="inputBox box6">
                                    <input
                                    type="file"
                                    name="coverImage"
                                    id="coverInput"
                                    onChange={inputHandler}
                                    required
                                    className="hidden"
                                    />
                                    {/* Custom label for cover image input */}
                                    <label
                                    htmlFor="coverInput"
                                    className="cursor-pointer inline-block px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                    >
                                    Choose Cover Image
                                    </label>
                                    {/* Display file name for cover image */}
                                    <div id="file-name-coverImage" className="mt-2 text-gray-600 italic">No file chosen</div>
                                </div>
                            </div>
                        </div>
                    <div className="links">
                    <a href="/login" className="text-red-700">Login</a>
                    </div>
                    <Button  type="submit" className="inputBox bg-red-800 hover:bg-red-600">
                        Signup
                    </Button>
                </form>
            </div>
        </div>
    </section>
    );
}

export default Signup;



