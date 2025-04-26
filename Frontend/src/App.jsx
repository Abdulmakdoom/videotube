import { useState, useEffect } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import Footer from './pages/Footer.jsx'
import Header from './pages/Header'


function App() {
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





