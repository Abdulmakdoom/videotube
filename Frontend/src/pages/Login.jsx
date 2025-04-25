import React, { useState } from "react";
import "../../public/login.css"
// import Input from "../components/Input";
import Button from "../components/Button";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/authSlice";
// import {restoreUser} from "../store/authSlice"
// import fetchWithAuth from "../utils/api";
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
        let url = import.meta.env.VITE_API_URL
    
    

        const inputHandler = (e)=> {
            let {name, value} = e.target;
            setFormData((prevData)=> ({
                ...prevData, 
                [name]: value
            }))
        }

        // console.log(formData);
        
        const loginHandler = async(e)=> {
            e.preventDefault();
            setError("")
            
        try {
            const response = await fetch(url+"/api/v1/users/login", {
                method: "POST",
                credentials: "include", // Ensures cookies are sent
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
                
            })

            //console.log(formData);
            
            
            const Data = await response.json()
            //console.log(Data.message);
            //console.log("Response Data:", Data);

            const userData = Data.data?.user
        // console.log(userData);
            
            dispatch(authLogin(userData))
            // dispatch(restoreUser(userData))

            if(!response.ok) {
                throw new Error(Data.message || "Something went wrong")
            }

            // alert("Login successfully!");
            navigate("/home")
            setError(Data.message)
            
        } catch (error) {
            setError(error.message)
        }
        
        }
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
                <a href="/signup">Signup</a>
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
