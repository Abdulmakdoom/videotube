
import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
// import { Link } from "react-router-dom";

function Signup() {
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        username: "",
        password: "",
        avatar: null,
        coverImage: null,
    });

    const inputHandler = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");

         // // Prepare FormData for multipart/form-data
    // const formDataToSend = new FormData();
    // formDataToSend.append("fullName", formData.fullName);
    // formDataToSend.append("email", formData.email);
    // formDataToSend.append("username", formData.username.toLowerCase()); // Convert to lowercase
    // formDataToSend.append("password", formData.password);
    // if (formData.avatar) formDataToSend.append("avatar", formData.avatar);
    // if (formData.coverImage) formDataToSend.append("coverImage", formData.coverImage);

        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        try {
            const response = await fetch("/api/v1/users/register", {
                method: "POST",
                body: formDataToSend,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong!");
            }

            alert("Account created successfully!");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-center text-3xl font-extrabold leading-tight mb-6 text-gray-900">
            Create Your VideoTube Account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
                Already have an account?&nbsp;
                   {/* <Link
                    to="/login"
                    className="font-medium text-primary transition-all duration-200 hover:underline"
                >
                    Sign In
                </Link> */}
            </p>

        {error && <p className="text-red-600 mt-4 text-center font-medium">{error}</p>}
    
        <form onSubmit={handleCreate} className="space-y-5">
            <Input label="Full Name" type="text" name="fullName" onChange={inputHandler} className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500" />
            <Input label="Email" type="email" name="email" onChange={inputHandler} className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500" />
            <Input label="Username" type="text" name="username" onChange={inputHandler} className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500" />
            <Input label="Password" type="password" name="password" onChange={inputHandler} className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500" />
            <Input label="Avatar" type="file" name="avatar" onChange={inputHandler} className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500" />
            <Input label="Cover Image" type="file" name="coverImage" onChange={inputHandler} className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500" />
    
            <Button type="submit" className="w-full bg-red-600 text-white hover:bg-red-700 transition duration-200 rounded-lg shadow-md py-3 font-semibold text-lg">
                Create Account
            </Button>
        </form>
    
        <p className="mt-6 text-center text-sm text-gray-600">
            By creating an account, you agree to our <a href="#" className="text-blue-500 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>.
        </p>
    </div>
    );
}

export default Signup;
