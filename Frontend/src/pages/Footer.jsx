import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
      <footer className="bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A] to-[#0A0A0A] text-white text-sm py-16 w-full shadow-xl">
        <div className="container mx-auto px-6 sm:px-12 lg:px-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12 text-center sm:text-left">
            
            {/* About */}
            <div className="bg-[#1A1A1A] p-6 rounded-xl shadow-2xl hover:scale-105 hover:shadow-2xl hover:bg-[#2d2d2d] transition-all duration-300">
              <h3 className="font-semibold mb-4 text-xl text-gray-200 tracking-wide hover:text-red-700 transition-colors">About</h3>
              <ul className="space-y-2">
                <li className="hover:text-gray-300 cursor-pointer hover:translate-x-2 transition-all">Press</li>
                <li className="hover:text-gray-300 cursor-pointer hover:translate-x-2 transition-all">Copyright</li>
                <li className="hover:text-gray-300 cursor-pointer hover:translate-x-2 transition-all">Contact Us</li>
              </ul>
            </div>

            {/* Community */}
            <div className="bg-[#1A1A1A] p-6 rounded-xl shadow-2xl hover:scale-105 hover:shadow-2xl hover:bg-[#2d2d2d] transition-all duration-300">
              <h3 className="font-semibold mb-4 text-xl text-gray-200 tracking-wide hover:text-red-700 transition-colors">Community</h3>
              <ul className="space-y-2">
                <li className="hover:text-gray-300 cursor-pointer hover:translate-x-2 transition-all">Advertise</li>
                <li className="hover:text-gray-300 cursor-pointer hover:translate-x-2 transition-all">Developers</li>
                <li className="hover:text-gray-300 cursor-pointer hover:translate-x-2 transition-all">Guidelines</li>
              </ul>
            </div>

            {/* Policies */}
            <div className="bg-[#1A1A1A] p-6 rounded-xl shadow-2xl hover:scale-105 hover:shadow-2xl hover:bg-[#2d2d2d] transition-all duration-300">
              <h3 className="font-semibold mb-4 text-xl text-gray-200 tracking-wide hover:text-red-700 transition-colors">Policies</h3>
              <ul className="space-y-2">
                <li className="hover:text-gray-300 cursor-pointer hover:translate-x-2 transition-all">Terms of Service</li>
                <li className="hover:text-gray-300 cursor-pointer hover:translate-x-2 transition-all">Privacy Policy</li>
                <li className="hover:text-gray-300 cursor-pointer hover:translate-x-2 transition-all">Safety & Security</li>
              </ul>
            </div>

            {/* Socials */}
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="font-semibold mb-4 text-xl text-gray-200 tracking-wide hover:text-red-700 transition-colors">Follow Us</h3>
              <div className="flex gap-6 flex-wrap justify-center sm:justify-start">
                <FaFacebook className="text-3xl cursor-pointer hover:text-blue-600 hover:scale-125 transition-transform" />
                <FaTwitter className="text-3xl cursor-pointer hover:text-blue-400 hover:scale-125 transition-transform" />
                <FaInstagram className="text-3xl cursor-pointer hover:text-pink-500 hover:scale-125 transition-transform" />
                <FaYoutube className="text-3xl cursor-pointer hover:text-red-600 hover:scale-125 transition-transform" />
              </div>
            </div>
          </div>

          <p className="text-center text-gray-200 mt-10 opacity-80 text-sm tracking-wide">
            &copy; {new Date().getFullYear()} VideoTube. All Rights Reserved.
          </p>
        </div>
      </footer>

  );
};

export default Footer;
