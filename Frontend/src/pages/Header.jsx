
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoutBtn from "../components/LogoutBtn";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faMagnifyingGlass, faClockRotateLeft, faHouse, faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { BiSolidVideos } from "react-icons/bi";
import { FcSettings } from "react-icons/fc";
import { BsPostcard } from "react-icons/bs";
import { CgLogIn } from "react-icons/cg";





const Sidebar = () => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [isSettingOpen, setSettingOpen] = useState(false);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const navItems = [
    { name: 'Home', icon: <FontAwesomeIcon icon={faHouse} />, path: '/home' },
    { name: 'Posts', icon: <BsPostcard className="text-xl"/> , path: `/posts` },
    { name: 'Subscriptions', icon: <FontAwesomeIcon icon={faCirclePlay} />, path: '/subscriptions' },
    { name: 'History', icon: <FontAwesomeIcon icon={faClockRotateLeft} />, path: '/home/history' },
    userData && { name: 'Your Videos', icon: <BiSolidVideos className="text-xl" />, path: '/videos' },
    // { name: 'Watch Later', icon: <MdOutlineWatchLater className="text-xl"/>, path: '' },
    userData && { name: 'User', icon: <FontAwesomeIcon icon={faCircleUser} />, path: `/${userData.username}` },
    !userData && {name: 'Login', icon: <CgLogIn /> , path: '/login' },
  ].filter(Boolean);

  const navItems2 = [
    { name: "Sign Up", page: "/signup" },
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
            <li key={item.name} className="mb-3">
              <button
                onClick={() => navigate(item.page)}
                className="px-4 py-1 text-xs sm:text-sm md:text-base font-medium text-white bg-red-600 rounded-full shadow-md transform transition-all duration-300 hover:bg-red-500 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
              >
                {item.name}
              </button>
            </li>
          )
        ))}

          {userData && (
            <li>
              <FcSettings onClick={toggleSetting} className="text-2xl sm:mr-6 mr-0" />
            </li>
          )}


          {isSettingOpen && (
            <div className="absolute top-10 mt-6 w-[300px] mr-10 right-0 bg-white p-6 border rounded-2xl shadow-xl transition-transform transform-gpu ease-in-out duration-300 scale-105">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
                <button onClick={() => setSettingOpen(false)} className="text-gray-500 hover:text-gray-700 transition duration-200 ease-in-out transform hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Create Video Button */}
                <div className="flex flex-col items-start gap-4">
                  <Link onClick={()=>setSettingOpen(false)} to={'/home/videos/publish'}>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-red-600 opacity-80 group-hover:opacity-100 transition duration-500 rounded-lg shadow-lg transform group-hover:scale-105"></div>
                      <div className="font-medium text-white relative z-10 py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:translate-x-3 cursor-pointer shadow-md group-hover:shadow-2xl">
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16M5 12l7-7 7 7" />
                          </svg>
                          Create Video
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                
                {/* Create Post Button */}
                <div className="flex flex-col items-start gap-4">
                  <Link onClick={()=>setSettingOpen(false)} to={'/home/posts/publish'}>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-white opacity-90 group-hover:opacity-100 transition duration-500 rounded-lg shadow-lg border-2 border-gray-200 transform group-hover:scale-105"></div>
                      <div className="font-medium text-gray-800 relative z-10 py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:translate-x-3 cursor-pointer shadow-md group-hover:shadow-lg">
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12l-7 7-7-7" />
                          </svg>
                          Create Post
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Create Playlist Button */}
                <div className="flex flex-col items-start gap-4">
                  <Link onClick={()=>setSettingOpen(false)} to={'/home/playlist/publish'}>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-white opacity-90 group-hover:opacity-100 transition duration-500 rounded-lg shadow-lg border-2 border-gray-200 transform group-hover:scale-105"></div>
                      <div className="font-medium text-gray-800 relative z-10 py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:translate-x-3 cursor-pointer shadow-md group-hover:shadow-lg">
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12l-7 7-7-7" />
                          </svg>
                          Create Playlist
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                
                {/* Logout Button */}
                {/* <div className="flex items-center gap-3 mt-6">
                  {userData ? (
                    <div onClick={() => setSettingOpen(false)} className="relative group">
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
                  ) : (
                    <p className="text-sm text-gray-600">Not logged in</p>
                  )}
                </div> */}
                  <div className="flex items-center justify-between border-t">
                          {userData ? (
                           <div className="flex-1">
                            <div onClick={() => setSettingOpen(false)} className="flex items-center gap-3">
                              <LogoutBtn />
                              
                            </div>
                            <p className="text-sm mt-3 text-gray-600">Logged in as {userData.username}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-600">Not logged in</p>
                          )}
                        </div>
                  </div>
                </div>
          )}
        </ul>

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



