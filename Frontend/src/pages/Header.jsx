import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import LogoutBtn from "../components/LogoutBtn";
import { useSelector } from "react-redux";


function Header() {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate()
    const userData = useSelector((state) => state.auth.userData);

    const navItems = [
        {
          name: "Home",
          page: "/home"
        },
        {
            name: "SignUp",
            page: "/signup"

        },
        {
            name: "Login",
            page: "/login"

        },
    ]


    return (
        <>
        <header className='flex items-center justify-between p-4 bg-white shadow-md w-full fixed top-0 left-0 z-50'>
      <div className='flex items-center'>
        {/* YouTube Logo */}
        <div className='text-2xl font-bold text-red-600'>
          VideoTube
        </div>
      </div>

      {/* Search Bar */}
      <div className='flex flex-grow mx-4'>
        <input
          type='text'
          placeholder='Search'
          className='flex-grow px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none'
        />
        <button className='px-4 py-2 bg-red-600 text-white rounded-r-full'>
          Search
        </button>
      </div>

      {/* Navigation Items for Desktop */}
      <ul className='hidden md:flex items-center space-x-4'>
        <div>{userData?.username}</div>
        {navItems.map((item) => (
          <li key={item.name}>
            <button
              onClick={() => navigate(item.page)}
              className='px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-full'
            >
              {item.name}
            </button>
          </li>
        ))}
        <li>
          <LogoutBtn />
        </li>
      </ul>

      {/* Mobile Menu Button */}
      <div className='md:hidden'>
        <button
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          className='text-gray-700 focus:outline-none'
        >
          {/* Icon for mobile menu (hamburger icon) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='absolute top-16 left-0 w-full bg-white shadow-lg md:hidden'>
          <ul className='flex flex-col items-center space-y-2 p-4'>
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => {
                    navigate(item.page);
                    setMobileMenuOpen(false); // Close the menu after navigation
                  }}
                  className='w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-full'
                >
                  {item.name}
                </button>
              </li>
            ))}
            <li>
              <LogoutBtn />
            </li>
          </ul>
        </div>
      )}
    </header>
        </>
    )
}

export default Header;