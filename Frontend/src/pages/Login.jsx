import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/authSlice";
// import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })


    // const userData1 = useSelector((state)=> state.auth.userData)
   

    const inputHandler = (e)=> {
        let {name, value} = e.target;
        setFormData((prevData)=> ({
            ...prevData, [name]: value
        }))
    }

    // console.log(formData);
    

    const loginHandler = async(e)=> {
        e.preventDefault();
        setError("")
        
       try {
        const response = await fetch("/api/v1/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        
        const Data = await response.json()
        //console.log("Response Data:", Data.data.user);

        const userData = Data.data.user
        dispatch(authLogin(userData))

        if(!response.ok) {
            throw new Error(Data.message || "Something went wrong")
        }

        // alert("Login successfully!");
        navigate("/home")
       
        
       } catch (error) {
        console.log(error);
        setError(error.message)
       }
       
    }


    return (
        <>
            <div className="flex flex-col h-screen">
                <main className="flex-grow flex items-center justify-center p-4">
                    <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg border border-gray-200">
                        <h2 className="text-center text-3xl font-extrabold leading-tight mb-6 text-gray-900">
                            Login
                        </h2>

                        {error && <p className="text-red-600 mt-4 text-center font-medium">{error}</p>}
                    
                        <form onSubmit={loginHandler} className="space-y-5"> 
                            <Input label="Email" type="email" name="email" onChange={inputHandler} className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"/>
                            <Input label="Password" type="password" name="password" onChange={inputHandler} className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"/>

                            <Button type="submit" className="w-full bg-red-600 text-white hover:bg-red-700 transition duration-200 rounded-lg shadow-md py-3 font-semibold text-lg">
                                Login
                            </Button>
                        </form>
                    </div>
                </main>
            </div>
        </>
    )
}

export default Login;