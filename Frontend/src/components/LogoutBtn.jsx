import React from "react";
import Button from "./Button";
import { useDispatch } from "react-redux";
import { logout as authLogout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "../utils/api";


function LogoutBtn() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    let url = import.meta.env.VITE_API_URL

    // const logoutHandler = async()=> {
    //     await fetchWithAuth(url+"/api/v1/users/logout", {
    //         method: "POST",
    //         credentials: "include",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //     })
    //     dispatch(authLogout())
    //     // alert("Logout successfully!");
    //     navigate("/login")
    // }

    const logoutHandler = async () => {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
      
          // Call logout API with refreshToken in the body
          await fetch(url + "/api/v1/users/logout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }), // Send it manually
          });
      
          // Clear tokens and logout state
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          dispatch(authLogout());
      
          // Navigate to login
          navigate("/login");
        } catch (error) {
          console.error("Logout failed:", error.message);
        }
      };
      

    return (
        <>
        <div className="flex items-center gap-3 mt-6">
            <div  onClick={logoutHandler} className="relative group">
            <div className="absolute inset-0 bg-gray-100 opacity-80 group-hover:opacity-100 transition duration-500 rounded-lg shadow-lg transform group-hover:scale-105"></div>
            <button
                className="flex items-center gap-2 text-sm text-gray-800 hover:text-red-600 relative z-10 py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:translate-x-3 cursor-pointer shadow-md group-hover:shadow-2xl"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-800 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 12l-7 7-7-7" />
                </svg>
                <span>Logout</span>
            </button>
            </div>
        </div> 

        </>
    )
}

export default LogoutBtn;