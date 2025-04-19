
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoutBtn from "../components/LogoutBtn";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faClockRotateLeft, faHouse, faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { BiSolidVideos } from "react-icons/bi";
import { FcSettings } from "react-icons/fc";
import { BsPostcard } from "react-icons/bs";
import { CgLogIn } from "react-icons/cg";
import { AiOutlineHome } from 'react-icons/ai';
import { IoMdArrowRoundBack } from "react-icons/io";






const Sidebar = () => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [isSettingOpen, setSettingOpen] = useState(false);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [showSearch, setShowSearch] = useState(true)
  const [searchInput, setSearchInput] = useState("")

  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { name: 'Home', icon: <FontAwesomeIcon icon={faHouse} />, path: '/home' },
    { name: 'Posts', icon: <BsPostcard className="text-xl"/> , path: `/posts` },
    { name: 'Following', icon: <FontAwesomeIcon icon={faCirclePlay} />, path: '/subscriptions' },
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

  const toggleShowSearch = ()=> {
    setShowSearch(!showSearch)
  }

  // Handle screen size change from small to medium
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)'); // Target medium screens (>=768px)

    const handleResize = () => {
      if (mediaQuery.matches) {
        setShowSearch(true) // Toggle showSearch when screen size increases to medium
      }
    };
    // Add event listener to listen for screen resize
    mediaQuery.addListener(handleResize);

    // Initial check
    handleResize();

    // Cleanup listener
    return () => mediaQuery.removeListener(handleResize);
  }, []);

  const inputHandler = (e)=>{
    const {value} = e.target;
    setSearchInput(value)
  }

  // const dataHandler = async ()=>{
  //   //console.log(searchInput);
    
  //  if(searchInput != ""){
  //     const response = await fetch(`/api/v1/videos/u/videos`)
  //     const result = await response.json()
  //     //console.log(result.data);
  //     const videosArray = result.data

  //     const searchVideos = videosArray.filter(video => video.description.includes(searchInput)) 
  //     console.log(searchVideos);
         
  //  }
    
  // }


  return (
    <>
      <header className="flex flex-wrap items-center justify-between px-4 py-3 shadow-md w-full fixed top-0 left-0 z-20 bg-[#0A0A0A] pl-25">
        {/* Logo Section */}
       {showSearch === true && <div className="flex items-center">
          <div className="text-2xl font-bold text-white">Video</div>
          <div className="text-2xl font-bold text-red-600">Tube</div>
        </div>}

        {/* Search Bar */}
        {showSearch === false && (
          <div className="flex-1 max-w-full flex sm:hidden">
            <IoMdArrowRoundBack onClick={toggleShowSearch} className="text-white text-4xl mr-3 hover:bg-[#232323] hover:rounded-full cursor-pointer mt-1" />

            <input
              onChange={inputHandler}
              type="text"
              placeholder="Search"
              className="w-full px-3 py-2 bg-[#1C1C1C] text-white border border-gray-700 rounded-l-full placeholder-gray-400 focus:outline-none"
            />
             <Link to={`/search/videos/${searchInput}`}>
              <button className="px-4 py-2 bg-[#1C1C1C] text-white rounded-r-full hover:bg-gray-800">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </Link>
          </div>
        )}


        {/* Search Bar 2 */}
        <div className="flex-1 mx-4 max-w-full sm:max-w-xs md:max-w-md lg:max-w-lg hidden sm:flex">
          <input
            onChange={inputHandler}
            type="text"
            placeholder="Search"
            className="w-full px-3 py-2 bg-[#1C1C1C] text-white border border-gray-700 rounded-l-full placeholder-gray-400 focus:outline-none"
          />
          <Link to={`/search/videos/${searchInput}`}>
              <button className="px-4 py-2 bg-[#1C1C1C] text-white rounded-r-full hover:bg-gray-800">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
          </Link>
        </div>

        {/* Right Controls */}
        <ul className="flex items-center space-x-3">
          {/* Show search icon on small devices only */}
          {showSearch === true  &&<li className="sm:hidden">
            <button onClick={toggleShowSearch} className="text-white text-lg cursor-pointer">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </li>}

          {/* Sign Up (if not logged in) */}
          {!userData &&
            navItems2.map(item => (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.page)}
                  className="px-4 py-1 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-500 focus:outline-none"
                >
                  {item.name}
                </button>
              </li>
            ))}

          {/* Avatar */}
          {userData && (
            <>
            {showSearch === true &&
              <Link to={`/${userData?.username}`}>
                <div className="relative group w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-xl cursor-pointer mr-2 sm:mr-8">
                  <img
                    src={userData?.avatar || '/default-avatar.jpg'}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            }
            </>
          )}

          {/* Settings */}
          {userData && (
            <>
              {showSearch === true &&<li>
                  <FcSettings onClick={toggleSetting} className="text-2xl mr-3" />
              </li>}
            </>
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
        <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`fixed top-0 left-0 bottom-0 flex gap-2 transition-all duration-400 bg-white/30 backdrop-blur-md ... rounded-[18px] overflow-hidden z-20 ${
        isExpanded ? 'w-[300px]' : 'w-[80px]'
      }`}
    >
      {/* Left Section */}
      <div className="z-10 w-[80px] flex flex-col items-center bg-[#0A0A0A]">
        <img src="https://media-hosting.imagekit.io/5c7833d9652a4f28/ChatGPT Image Apr 16, 2025, 06_57_22 PM.png?Expires=1839422393&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=GP2y6yRlDMmGpGtiCr-~pA9Z0KgpQz8hXFHRMECLamwZbqHtM6kLoL5zkeabZnmwLzuCz8jkrfTWNdynV2bzGnIWi~~uIpRDVf8yYa~OYwUcSMgIuzEmQ8uKAJbSCNi4e-wa1WFzsFIegF7c6n4WVu7x92gpKxtEeMu1n95kMYc~UO7HfRASAiEzJWs3LBMfMTd08wWtJlsoV1TS9toq6yZ8cli-BWT0WfeGTOfgXPVB~-27IDXQW2Ha3iQyyLTxVIN9znQ4CtXKizDPzFPI3nqRtPo7RTww7-xg5ueEi9jFqhOPJ0JbtDR4u~EX5huXKuxpnK2c05B-ef~QywRSTg__" alt="Logo" className="w-15 h-15 my-1.5" />
        <button onClick={()=> navigate('/home')} className="mt-7 w-11 h-11 grid place-items-center rounded-lg text-white hover:bg-[#f4f6fa] hover:text-[#384251] text-2xl">
          <AiOutlineHome />
        </button>
        <button onClick={()=> navigate('/posts')} className="mt-6 w-11 h-11 grid place-items-center rounded-lg text-white hover:bg-[#f4f6fa] hover:text-[#384251] text-2xl">
        <BsPostcard />
        </button>
        <button onClick={()=> navigate('/subscriptions')} className="mt-6 w-11 h-11 grid place-items-center rounded-lg text-white hover:bg-[#f4f6fa] hover:text-[#384251] text-2xl">
        <FontAwesomeIcon icon={faCirclePlay} />
        </button>
        <button onClick={()=> navigate('/home/history')} className="mt-6 w-11 h-11 grid place-items-center rounded-lg text-white hover:bg-[#f4f6fa] hover:text-[#384251] text-2xl">
        <FontAwesomeIcon icon={faClockRotateLeft} />
        </button>
        <button onClick={()=> navigate('/videos')} className="mt-6 w-11 h-11 grid place-items-center rounded-lg text-white hover:bg-[#f4f6fa] hover:text-[#384251] text-2xl">
        <BiSolidVideos />
        </button>
        {userData &&<button onClick={()=> navigate(`/${userData.username}`)} className="mt-6 w-11 h-11 grid place-items-center rounded-lg text-white hover:bg-[#f4f6fa] hover:text-[#384251] text-2xl">
        <FontAwesomeIcon icon={faCircleUser} />
        </button>}
        {!userData && <button onClick={()=> navigate('/login')} className="mt-6 w-11 h-11 grid place-items-center rounded-lg text-white hover:bg-[#f4f6fa] hover:text-[#384251] text-2xl">
        <CgLogIn />
        </button>}
        {/* Add more icons/buttons here */}
      </div>

      {/* Right Section */}
      <div
        className={`relative h-full transition-all duration-400 ${
          isExpanded ? 'w-[225px]' : 'w-0'
        }`}
      >
        <div className="absolute inset-2 bg-[#0A0A0A] rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-5">
            <div>
              <h2 className="text-xl font-semibold text-white">VideoTube</h2>
              {/* <h3 className="text-xs font-medium text-[#9fa4af]">store.untitledui.com</h3> */}
            </div>
          </div>

          {/* Nav */}
          <nav className="px-3">
            {navItems.map(item => (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.path)}
                    //className="flex items-center space-x-3 text-white hover:bg-gray-400 hover:text-black px-4 py-2 rounded-md w-full"
                    //className="ml-auto text-xs opacity-0 group-hover:opacity-100 transition text-white"
                    className="w-full h-11 px-3 flex items-center gap-2 text-sm rounded-md text-white hover:bg-[#e8ecf4] hover:text-[#384251] transition"
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}

          </nav>
        </div>
      </div>
    </aside>

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



