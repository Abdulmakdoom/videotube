import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-red-700 text-white text-sm py-6 w-full ">
        <div className="max-w-full px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            {/* About Section */}
            <div>
              <h3 className="font-semibold mb-3">About</h3>
              <ul className="space-y-1">
                <li className="hover:text-gray-300 cursor-pointer transition">Press</li>
                <li className="hover:text-gray-300 cursor-pointer transition">Copyright</li>
                <li className="hover:text-gray-300 cursor-pointer transition">Contact Us</li>
              </ul>
            </div>

            {/* Community Section */}
            <div>
              <h3 className="font-semibold mb-3">Community</h3>
              <ul className="space-y-1">
                <li className="hover:text-gray-300 cursor-pointer transition">Advertise</li>
                <li className="hover:text-gray-300 cursor-pointer transition">Developers</li>
                <li className="hover:text-gray-300 cursor-pointer transition">Guidelines</li>
              </ul>
            </div>

            {/* Policies Section */}
            <div>
              <h3 className="font-semibold mb-3">Policies</h3>
              <ul className="space-y-1">
                <li className="hover:text-gray-300 cursor-pointer transition">Terms of Service</li>
                <li className="hover:text-gray-300 cursor-pointer transition">Privacy Policy</li>
                <li className="hover:text-gray-300 cursor-pointer transition">Safety & Security</li>
              </ul>
            </div>

            {/* Social Media Section */}
            <div>
              <h3 className="font-semibold mb-3">Follow Us</h3>
              <div className="flex justify-center md:justify-start space-x-4">
                <FaFacebook className="text-xl cursor-pointer hover:text-gray-300 transition" />
                <FaTwitter className="text-xl cursor-pointer hover:text-gray-300 transition" />
                <FaInstagram className="text-xl cursor-pointer hover:text-gray-300 transition" />
                <FaYoutube className="text-xl cursor-pointer hover:text-black transition" />
              </div>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-center text-gray-200 mt-6 opacity-80">
            &copy; {new Date().getFullYear()} YouTube Clone. All Rights Reserved.
          </p>
        </div>
    </footer>
  );
};

export default Footer;
