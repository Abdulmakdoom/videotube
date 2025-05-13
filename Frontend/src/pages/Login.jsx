import React, { useState } from "react";
import "../../public/login.css"
import Button from "../components/Button";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import {persistor} from '../store/store.js'



function Login() {

        const dispatch = useDispatch()
        const navigate = useNavigate()
        const [error, setError] = useState("");
        const [formData, setFormData] = useState({
            email: "",
            password: "",
        })
        let url = import.meta.env.VITE_API_URL
    
    

        const inputHandler = (e)=> {
            let {name, value} = e.target;
            setFormData((prevData)=> ({
                ...prevData, 
                [name]: value
            }))
        }
        
        // const loginHandler = async(e)=> {
        //     e.preventDefault();
        //     setError("")
            
        // try {
        //     const response = await fetch(url+"/api/v1/users/login", {
        //         method: "POST",
        //         credentials: "include", // Ensures cookies are sent
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify(formData),
                
        //     })

            
            
        //     const Data = await response.json()

        //     const userData = Data.data?.user
            
        //     dispatch(authLogin(userData))

        //     if(!response.ok) {
        //         throw new Error(Data.message || "Something went wrong")
        //     }

        //     // alert("Login successfully!");
        //     navigate("/home")
        //     setError(Data.message)
            
        // } catch (error) {
        //     setError(error.message)
        // }
        
        // }

        const loginHandler = async (e) => {
            e.preventDefault();
            setError(""); // Clear any previous errors
            
            try {
                const response = await fetch(url + "/api/v1/users/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });
        
                const data = await response.json();                
        
                if (!response.ok) {
                    throw new Error(data.message || "Something went wrong");
                }
        
                const userData = data.data?.user;

                // Optional: clear persisted state before setting new user
                await persistor.purge(); // This will clear `persist:root` in localStorage
        
                // Dispatch user data to store (if you're using Redux)
                dispatch(authLogin(userData));
        
                // Store accessToken and refreshToken in localStorage
                localStorage.setItem("accessToken", data.data.accessToken);
                localStorage.setItem("refreshToken", data.data.refreshToken);
                localStorage.removeItem("persist:root");

                // Optionally, store user data in localStorage for persistence
                // localStorage.setItem("user", JSON.stringify(userData));
        
                // Redirect to the home page
                navigate("/home");
                
                setError(""); // Clear the error message after successful login
            } catch (error) {
                // Handle any errors that occur during the login process
                setError(error.message);
            }
        };
        
    return (
        <section>
      {/* Span elements for styling */}
      {[...Array(150)].map((_, index) => (
        <span key={index}></span>
      ))}

      <div className="signin">
        <div className="content">
          <h2 className="text-red-700">Login In</h2>
          {error && <p className="text-red-600 mt-4 text-center font-medium">{error}</p>}
          <form className="form" onSubmit={loginHandler}>
                <div className="inputBox">
                <input label="Email" type="email" name="email" onChange={inputHandler} required />
                <i>Email</i>
                </div>
                <div className="inputBox">
                <input label="Password" type="password" name="password" onChange={inputHandler} required />
                <i>Password</i>
                </div>
                <div className="links">
                {/* <a href="#">Forgot Password</a> */}
                <a href="/signup" className="text-red-700">Signup</a>
                </div>
                <Button type="submit" className="inputBox bg-red-800 hover:bg-red-600">
                   Login
                </Button>
          </form>
        </div>
      </div>
    </section>
    )
}

export default Login;
