import React, {useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Spinner from "../../components/Loader";




function AccountEdit () {
    const { username } = useParams();
     const [data, setData] = useState({});
     const [loading, setLoading] = useState(false);
     const navigate = useNavigate()
     const [error, setError] = useState('')

     const [formData, setFormData] = useState({
        fullName : "",
        email : ""
     })

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`/api/v1/users/c/${username}`, {
                method: 'GET',
                credentials: 'include',
            });
            const result = await response.json();
            setData(result?.data);
            setFormData({
                fullName: result?.data?.fullName,
                email: result?.data?.email
            })
        };

        fetchUser();
    }, [username]);


    const inputHandler = (e)=> {
        const {name, value} = e.target;

        setFormData((prevData)=> ({
            ...prevData, [name]: value
        }))
    }

    const dataHandler = async(e)=> {
        e.preventDefault();
        setLoading(true)
        try {

            const response = await fetch('/api/v1/users/update-account', {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            }) 
    
            const result = await response.json()
            

            if(!response.ok){
                setLoading(false)
                setError(result.message)
            }
            setLoading(false)
            navigate(`/${username}`)
            
        } catch (error) {
            setError(false)
            console.log(error.message);
        }

        
    }

    //console.log(formData);
    

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r pl-20">
        <div className="p-8 rounded-xl shadow-xl bg-[#212121] transform transition-all duration-300  mx-auto w-full max-w-md">
            <h2 className="text-white text-2xl font-bold mb-6 text-center">Update Account</h2>

            <form 
            onSubmit={dataHandler}
             className="space-y-6">
            {/* Playlist Name */}
            <Input
                onChange={inputHandler}
                value={formData?.fullName}
                className="bg-[#2b2b2b] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white w-full p-3 placeholder-gray-400 transition duration-300 ease-in-out"
                label="Full Name"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                required
            />

            {/* Playlist Description */}
            <Input
                onChange={inputHandler}
                value={formData?.email}
                className="bg-[#2b2b2b] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white w-full p-3 placeholder-gray-400 transition duration-300 ease-in-out"
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
            />

           

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
                Update Account
            </Button>

            {/* Success or Error Messages */}
            {error && (
                <p className="text-red-600 mt-4 text-center text-lg animate__animated animate__fadeIn">{error}</p>
            )}
            </form>
        </div>
        </div>
        </>
    )
}

export default AccountEdit;