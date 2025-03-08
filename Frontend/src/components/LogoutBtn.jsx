import React from "react";
import Button from "./Button";
import { useDispatch } from "react-redux";
import { logout as authLogout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";


function LogoutBtn() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logoutHandler = async()=> {
        await fetch("/api/v1/users/logout", {
            method: "POST"
        })
        dispatch(authLogout())
        alert("Logout successfully!");
        navigate("/login")
    }

    return (
        <>
        <Button onClick={logoutHandler} className="bg-red-600">
            Log Out
        </Button>
        </>
    )
}

export default LogoutBtn;