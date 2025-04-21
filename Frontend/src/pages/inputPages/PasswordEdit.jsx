import React, {useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";

function PasswordEdit () {
    const { username } = useParams();
    const [data, setData] = useState({});
    //const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const [error, setError] = useState('')
    let url = "http://localhost:8000" || "https://videotube-e1hm.onrender.com"


    const [formData, setFormData] = useState({
        oldPassword : "",
        newPassword : ""
    })


     useEffect(() => {
            const fetchUser = async () => {
                const response = await fetch(`${url}/api/v1/users/c/${username}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const result = await response.json();
                setData(result?.data);
            };
    
            fetchUser();
        }, [username]);

        const inputHandler = (e)=> {
            const {name, value} = e.target;

            setFormData((prevData)=> ({
                ...prevData, [name] : value
            }))
            
        }

        const dataHandler = async (e)=>{
            e.preventDefault();
            setError("")

            try {
                const response = await fetch(`${url}/api/v1/users/change-password`, {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData)
                })

                const result = await response.json()
                //console.log(result);

                if(!response.ok){
                    throw new Error(result.message)
                }

                navigate(`/${username}`)
                
            } catch (error) {
                setError(error.message)
            }
        }

    return (
        <>
             <div className="flex items-center justify-center min-h-screen bg-gradient-to-r pl-20">
                <div className="p-8 rounded-xl shadow-xl bg-[#212121] transform transition-all duration-300  mx-auto w-full max-w-md">
                    <h2 className="text-white text-2xl font-bold mb-6 text-center">Change Password</h2>

                    {error && (
                        <p className="text-red-600 mt-4 text-center text-lg animate__animated animate__fadeIn">{error}</p>
                    )}

                    <form 
                    onSubmit={dataHandler}
                    className="space-y-6">
                    {/* Playlist Name */}
                    <Input
                        onChange={inputHandler}
                        className="bg-[#2b2b2b] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white w-full p-3 placeholder-gray-400 transition duration-300 ease-in-out"
                        label="Old Password"
                        name="oldPassword"
                        type="password"
                        placeholder="Enter your old password"
                        required
                    />

                    {/* Playlist Description */}
                    <Input
                        onChange={inputHandler}
                        className="bg-[#2b2b2b] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white w-full p-3 placeholder-gray-400 transition duration-300 ease-in-out"
                        label="New Password"
                        name="newPassword"
                        type="paswword"
                        placeholder="Enter your new password"
                        required
                    />


                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full py-3 bg-red-800 text-white rounded-md hover:bg-red-600 focus:ring-4 focus:ring-blue-300 transition duration-200"
                    >
                        Update Password
                    </Button>
                    
                    </form>
                </div>
        </div>
        </>
    )
}

export default PasswordEdit;