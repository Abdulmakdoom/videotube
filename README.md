# VideoTube

-[Model link](https://videotube-gules.vercel.app/)


# 🎬 VideoTube - Full Stack MERN Project

**VideoTube** is a full-featured video-sharing platform built with the MERN stack — **MongoDB**, **Express.js**, **React (Vite)**, and **Node.js**. Users can register, upload and stream videos, manage their profile, subscribe to other users, and track their watch history. All wrapped in a clean and responsive UI.

---

## 🚀 Features

- 🔐 JWT-based Authentication (Register, Login, Logout, Token Refresh)
- 📤 Video Uploads with Cloudinary
- 📺 Video Streaming
- 👍 Like/Dislike Videos
- 🔔 Subscribe to Users
- 👤 Profile Management (Avatar & Cover Image)
- 🕒 Watch History Tracking
- 🔍 Search Functionality
- 🌐 Responsive Design using Tailwind CSS
- 🎞 Smooth Animations with Framer Motion

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Router DOM
- Axios
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- Cloudinary (Media Storage)
- Multer (File Upload Handling)
- Dotenv


---

## ⚙️ Installation & Setup

1. **Clone the repository**
git clone https://github.com/Abdulmakdoom/videotube.git


2. **Goto backend directory**
cd Backend
3. **Install the dependencies**
npm i
4. **Create a .env file in the backend folder**
PORT=your_port (ex:- 5000)
MONGODB_URI=Your_mongodb_url

CORS_ORIGIN=*

ACCESS_TOKEN_SECRET=your_token_secret
ACCESS_TOKEN_EXPIRY=your_expiry_secret
REFRESH_TOKEN_EXPIRY=your_expiry_secret
REFRESH_TOKEN_SECRET=your_token_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

5. **Create a .env file in the frontend folder**
VITE_API_URL="Backend url"

## Run the backend:
npm run dev

1. **Frontend Setup (Vite + React)**
cd Frontend
2. **Install the dependencies**
npm i



