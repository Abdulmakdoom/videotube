
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutBtn from "../components/LogoutBtn";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faMagnifyingGlass, faClockRotateLeft, faHouse, faCirclePlay} from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';

const Sidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  //console.log(userData);
  

  const navItems = [
    { name: 'Home', icon: <FontAwesomeIcon icon={faHouse}/>, path: '/home' },
    { name: 'Trending', icon: '🔥', path: '/trending' },
    { name: 'Subscriptions', icon: <FontAwesomeIcon icon={faCirclePlay}/>, path: '/subscriptions' },
    { name: 'Library', icon: '📚', path: '/library' },
    { name: 'History', icon: <FontAwesomeIcon icon={faClockRotateLeft}/>, path: '/home/history' },
    { name: 'Your Videos', icon: '🎬', path: '/your-videos' },
    { name: 'Watch Later', icon: '⏰', path: '/watch-later' },
    { name: 'user', icon: <FontAwesomeIcon icon={faCircleUser}/>, path: `/${userData?.username}`}

  ];

  const navItems2 = [
    {
        name: "SignUp",
        page: "/signup"
    },
    {
        name: "Login",
        page: "/login"
    },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <header className='flex items-center justify-between p-4  shadow-md w-full fixed top-0 left-0 z-20 bg-[#0A0A0A]'>
        <div className='flex items-center'>
          {/* Logo */}
          <div className='text-2xl ml-12 font-bold text-red-600'>
            VideoTube
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mx-4">
          <div className="flex h-10 w-full sm:max-w-xs md:max-w-md lg:max-w-lg">
            <input
              type="text"
              placeholder="Search"
              className="w-full sm:w-140 px-2 py-1 border bg-[#1C1C1C] text-white border-gray-700 placeholder-gray-500 rounded-l-full focus:outline-none"
            />
            <button className="w-16 px-2 py-1 bg-[#1C1C1C] text-white rounded-r-full">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
        </div>

        {/* Navigation Items for Desktop */}
        <ul className='hidden md:flex items-center space-x-4'>
          <div>{userData?.username}</div>
          {navItems2.map((item) => (
            <li key={item.name}>
              {!userData && <button
                onClick={() => navigate(item.page)}
                className='px-4 py-2 text-white rounded-full'
              >
                {item.name}
              </button>}
            </li>
          ))}
          <li>
           {userData && <LogoutBtn />}
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <div className='md:hidden'>
          <button
            onClick={toggleSidebar}
            className='text-gray-700 focus:outline-none'
          >
            <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
          </button>
        </div>
      </header>

      <div className="relative">
        {/* Hamburger Icon for small screens */}
        <div className="absolute top-4 left-4 z-50">
            <button onClick={toggleSidebar}>
                <FontAwesomeIcon icon={faBars} className="text-3xl text-gray-200 mt-1 fixed top-4 left-4" />
            </button>
        </div>

        {/* Sidebar (always visible on large screens, toggles on small screens) */}
        <div
          className={`fixed top-0 left-0 h-full bg-[#0A0A0A] shadow-lg w-64 transform transition-transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } z-40`} 
        >
          <div className="flex flex-col items-start p-4">
            <div className="text-2xl ml-12 mt-1 font-bold text-red-600 mb-8">VideoTube</div>
            <ul className="space-y-6">
              {navItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.path)}
                    className="flex items-center space-x-3 text-white hover:bg-gray-400 hover:text-black px-4 py-2 rounded-md w-full"
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Overlay (for when sidebar is open) */}
        {isSidebarOpen && (
          <div
            className="sticky top-0 left-0 w-full h-full bg-black opacity-50 z-30"
            onClick={toggleSidebar}
          />
        )}
      </div>
    </>
  );
};

export default Sidebar;



