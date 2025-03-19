import { useState, useEffect } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import Footer from './pages/Footer.jsx'
import Header from './pages/Header'


function App() {
    // 🔹 Check Auth on Refresh (Get New Access Token)
    // useEffect(() => {
    //   const refreshAuth = async () => {
    //     const response = await fetch("/api/v1/users/refresh-token", {
    //       method: "POST",
    //       credentials: "include", // Sends refresh token in cookies
    //     });
  
    //     const data = await response.json();
    //     if (response.ok) {
    //       //setAccessToken(data.accessToken);
    //     }
    //   };
  
    //   refreshAuth(); // Call refresh token endpoint on page load
    // }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Make sure main takes all available space */}
      <main className="flex-grow">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
}


  

export default App
