
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoutBtn from "../components/LogoutBtn";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faMagnifyingGlass, faClockRotateLeft, faHouse, faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { BiSolidVideos } from "react-icons/bi";
import { FcSettings } from "react-icons/fc";

const Sidebar = () => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [isSettingOpen, setSettingOpen] = useState(false);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const navItems = [
    { name: 'Home', icon: <FontAwesomeIcon icon={faHouse} />, path: '/home' },
    { name: 'Trending', icon: '🔥', path: '' },
    { name: 'Subscriptions', icon: <FontAwesomeIcon icon={faCirclePlay} />, path: '/subscriptions' },
    { name: 'Library', icon: '📚', path: '' },
    { name: 'History', icon: <FontAwesomeIcon icon={faClockRotateLeft} />, path: '/home/history' },
    { name: 'Your Videos', icon: <BiSolidVideos className="text-xl" />, path: '/videos' },
    { name: 'Watch Later', icon: '⏰', path: '' },
    userData && { name: 'User', icon: <FontAwesomeIcon icon={faCircleUser} />, path: `/${userData.username}` },
  ].filter(Boolean);

  const navItems2 = [
    { name: "Sign Up", page: "/signup" },
    { name: "Login", page: "/login" },
  ];

  const toggleSidebar = () => {
    setLeftSidebarOpen(!leftSidebarOpen);
  };

  const toggleSetting = () => {
    setSettingOpen(!isSettingOpen);
  };

  return (
    <>
      <header className='flex items-center justify-between p-4 shadow-md w-full fixed top-0 left-0 z-20 bg-[#0A0A0A]'>
        <div className='text-2xl ml-12 font-bold text-red-600'>VideoTube</div>

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

        <ul className='md:flex items-center space-x-4'>
          {navItems2.map(item => (
            !userData && (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.page)}
                  className='px-4 py-2 text-white rounded-full'
                >
                  {item.name}
                </button>
              </li>
            )
          ))}
          {userData && (
            <li>
              <FcSettings onClick={toggleSetting} className="text-2xl mr-6" />
            </li>
          )}
          {isSettingOpen && (
            <div className="absolute top-10 mt-4 mr-10 right-0 bg-white p-6 border rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
                <button onClick={() => setSettingOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col items-start gap-2">
                  <Link to={'/home/videos/publish'}>
                      <div className="font-medium text-gray-700 hover:text-red-700">Upload Video</div>
                  </Link>
                </div>
                <div>
                  {userData ? (
                    <div className="flex items-center gap-3">
                      <LogoutBtn />
                      <p className="text-sm text-gray-600">Logged in as {userData.username}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">Not logged in</p>
                  )}
                </div>
              </div>
            </div>
          )}


        </ul>

        <div className='md:hidden'>
          {userData && (
            <button onClick={toggleSetting} className='text-gray-700 focus:outline-none'>
              <FcSettings className="text-2xl" />
            </button>
          )}
        </div>
      </header>

      <div className="relative">
        <div className="fixed top-4 left-4 z-50">
          <button onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} className="text-3xl text-gray-200 mt-1" />
          </button>
        </div>

        <div
          className={`fixed top-0 left-0 h-full bg-[#0A0A0A] shadow-lg w-64 transform transition-transform ${
            leftSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } z-40`}
        >
          <div className="flex flex-col items-start p-4">
            <div className="text-2xl ml-12 mt-1 font-bold text-red-600 mb-8">VideoTube</div>
            <ul className="space-y-6">
              {navItems.map(item => (
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

        {leftSidebarOpen && (
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



