import React from "react";
import Button from "./Button";


function LogoutBtn() {

    const logoutHandler = async()=> {
        await fetch("/api/v1/users/logout", {
            method: "POST"
        })

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