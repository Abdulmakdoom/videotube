import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

function PageNotFound() {
        const userData = useSelector((state) => state.auth.userData);
        const userId = userData?._id; 
  return (
   <>
     {userId && <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 sm:px-6 lg:px-20 mt-10 pb-16 pl-22">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-xl w-full"
        >
          <motion.h1
            className="text-7xl sm:text-8xl font-extrabold text-red-600 drop-shadow-lg"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            404
          </motion.h1>
      
          <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
            Oops! Page Not Found
          </h2>
          <p className="mt-2 text-gray-300 text-base sm:text-lg max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Try going back to the homepage.
          </p>
      
          <Link
            to="/"
            className="inline-block mt-6 px-6 sm:px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-md hover:shadow-red-500/40 transition-all duration-300"
          >
            Go Home
          </Link>
      
          <motion.div
            className="mt-10 sm:mt-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <img
              src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
              alt="404 illustration"
              className="w-64 sm:w-80 md:w-[420px] mx-auto rounded-xl shadow-lg"
            />
          </motion.div>
        </motion.div>
      </div>}


        {!userId &&
          <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 sm:px-6 lg:px-20 mt-10 pb-16 pl-22">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-xl w-full"
          >
            <motion.h1
              className="text-7xl sm:text-8xl font-extrabold text-red-600 drop-shadow-lg"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              404
            </motion.h1>

            <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
              Oops! Page Not Found
            </h2>
            <p className="mt-2 text-gray-300 text-base sm:text-lg max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved. Try going back to the homepage.
            </p>

            <Link
              to="/"
              className="inline-block mt-6 px-6 sm:px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-md hover:shadow-red-500/40 transition-all duration-300"
            >
              Go Home
            </Link>

            <motion.div
              className="mt-10 sm:mt-12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <img
                src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
                alt="404 illustration"
                className="w-64 sm:w-80 md:w-[420px] mx-auto rounded-xl shadow-lg"
              />
            </motion.div>
          </motion.div>
        </div>}
   </>
  
  );
}

export default PageNotFound;

