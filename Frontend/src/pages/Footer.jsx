import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A] to-[#0A0A0A] text-white text-sm py-16 w-full static shadow-xl pl-20">
      <div className="px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center md:text-left">
          
          {/* About Section */}
          <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-2xl transform transition-all hover:scale-105 hover:shadow-2xl hover:bg-[#333]">
            <h3 className="font-semibold mb-4 text-xl text-gray-200 tracking-wide transition-all transform hover:text-red-700">About</h3>
            <ul className="space-y-2">
              <li className="hover:text-gray-300 cursor-pointer transition duration-300 transform hover:translate-x-2">Press</li>
              <li className="hover:text-gray-300 cursor-pointer transition duration-300 transform hover:translate-x-2">Copyright</li>
              <li className="hover:text-gray-300 cursor-pointer transition duration-300 transform hover:translate-x-2">Contact Us</li>
            </ul>
          </div>

          {/* Community Section */}
          <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-2xl transform transition-all hover:scale-105 hover:shadow-2xl hover:bg-[#333]">
            <h3 className="font-semibold mb-4 text-xl text-gray-200 tracking-wide transition-all transform hover:text-red-700">Community</h3>
            <ul className="space-y-2">
              <li className="hover:text-gray-300 cursor-pointer transition duration-300 transform hover:translate-x-2">Advertise</li>
              <li className="hover:text-gray-300 cursor-pointer transition duration-300 transform hover:translate-x-2">Developers</li>
              <li className="hover:text-gray-300 cursor-pointer transition duration-300 transform hover:translate-x-2">Guidelines</li>
            </ul>
          </div>

          {/* Policies Section */}
          <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-2xl transform transition-all hover:scale-105 hover:shadow-2xl hover:bg-[#333]">
            <h3 className="font-semibold mb-4 text-xl text-gray-200 tracking-wide transition-all transform hover:text-red-700">Policies</h3>
            <ul className="space-y-2">
              <li className="hover:text-gray-300 cursor-pointer transition duration-300 transform hover:translate-x-2">Terms of Service</li>
              <li className="hover:text-gray-300 cursor-pointer transition duration-300 transform hover:translate-x-2">Privacy Policy</li>
              <li className="hover:text-gray-300 cursor-pointer transition duration-300 transform hover:translate-x-2">Safety & Security</li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold mb-4 text-xl text-gray-200 tracking-wide transition-all transform hover:text-red-700">Follow Us</h3>
            <div className="flex space-x-6">
              <FaFacebook
                className="text-3xl cursor-pointer hover:text-blue-600 transition duration-300 transform hover:scale-125"
                style={{ transition: "transform 0.2s ease-in-out" }}
              />
              <FaTwitter
                className="text-3xl cursor-pointer hover:text-blue-400 transition duration-300 transform hover:scale-125"
                style={{ transition: "transform 0.2s ease-in-out" }}
              />
              <FaInstagram
                className="text-3xl cursor-pointer hover:text-pink-500 transition duration-300 transform hover:scale-125"
                style={{ transition: "transform 0.2s ease-in-out" }}
              />
              <FaYoutube
                className="text-3xl cursor-pointer hover:text-red-600 transition duration-300 transform hover:scale-125"
                style={{ transition: "transform 0.2s ease-in-out" }}
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-gray-200 mt-8 opacity-80 text-sm tracking-wide">
          &copy; {new Date().getFullYear()} VideoTube. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
