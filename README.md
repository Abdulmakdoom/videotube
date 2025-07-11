<div align="center">

# 🎬 VIDEOTUBE  
### 🚀 Full Stack MERN Project

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge&logo=vercel)](https://videotube-gules.vercel.app/)

</div>
<br/>

**VideoTube** is a full-featured video-sharing platform built with the MERN stack — **MongoDB**, **Express.js**, **React (Vite)**, and **Node.js**. Users can register, upload and stream videos, manage their profile, subscribe to other users, and track their watch history. All wrapped in a clean and responsive UI.

---

**Transforming Video Sharing Into Limitless Possibilities**
<br/>
<div align="center"> 
  
![Last Commit](https://img.shields.io/github/last-commit/Abdulmakdoom/videotube?color=blue)&nbsp;&nbsp;&nbsp;![JavaScript](https://img.shields.io/badge/javascript-97.4%25-yellow)&nbsp;&nbsp;&nbsp;![Languages](https://img.shields.io/github/languages/count/Abdulmakdoom/videotube)

</div>
---
## Built with the tools and technologies:

<div align="center"> 
 <br/> 
  
![Express](https://img.shields.io/badge/-Express-black?logo=express)&nbsp;&nbsp;&nbsp;
![JSON](https://img.shields.io/badge/-JSON-000000?logo=json)&nbsp;&nbsp;&nbsp;
![Markdown](https://img.shields.io/badge/-Markdown-lightgrey?logo=markdown&logoColor=black)&nbsp;&nbsp;&nbsp;
![npm](https://img.shields.io/badge/-npm-red?logo=npm)&nbsp;&nbsp;&nbsp;
![Mongoose](https://img.shields.io/badge/-Mongoose-darkred?logo=mongodb)&nbsp;&nbsp;&nbsp;
![Prettier](https://img.shields.io/badge/Prettier-ffffff?logo=prettier&logoColor=black)
&nbsp;&nbsp;&nbsp;
![ENV](https://img.shields.io/badge/-ENV-yellow?logo=dotenv&logoColor=red)<br/>

![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black)&nbsp;&nbsp;&nbsp;
![Nodemon](https://img.shields.io/badge/-Nodemon-green?logo=nodemon&logoColor=white)&nbsp;&nbsp;&nbsp;
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black)&nbsp;&nbsp;&nbsp;
![Cloudinary](https://img.shields.io/badge/-Cloudinary-blue?logo=cloudinary)&nbsp;&nbsp;&nbsp;
![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white)&nbsp;&nbsp;&nbsp;
![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?logo=eslint)&nbsp;&nbsp;&nbsp;
![Axios](https://img.shields.io/badge/-Axios-5A29E4?logo=axios)
  
</div>

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
- Fetch/Axios
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

**Clone the repository**
<pre>git clone https://github.com/Abdulmakdoom/videotube.git</pre>

## Backend Setup (Node.js + Express)
<pre>cd Backend</pre>

1. **Install the dependencies**
<pre>npm i</pre>

2. **Create a .env file in the backend folder**
<pre>PORT=your_port (ex:- 5000)
MONGODB_URI=Your_mongodb_url

CORS_ORIGIN=*

ACCESS_TOKEN_SECRET=your_token_secret
ACCESS_TOKEN_EXPIRY=your_expiry_secret
REFRESH_TOKEN_EXPIRY=your_expiry_secret
REFRESH_TOKEN_SECRET=your_token_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret</pre>

3. **Run the backend:**
<pre>npm run dev</pre>

## Frontend Setup (Vite + React)
<pre>cd Frontend</pre>

1. **Install the dependencies**
<pre>npm i</pre>

2. **Create a .env file in the frontend folder**
<pre>VITE_API_URL="Backend url"</pre>

3. **Run the frontend:**
<pre>npm run dev</pre>

## 🌐 Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Cloud Storage: Cloudinary

## 📌 To-Do / Future Improvements
- Notifications
- Trending Page
- Video Categories & Tags
- Dark Mode


## 🚀 Usage
Ensure that your MongoDB server is running and that the connection string is properly configured in the .env file.

The backend server runs by default at:
http://localhost:8080

### ✨ Features
🔐 User Authentication and Authorization
- User Registration & Login – Secure authentication using bcrypt for password hashing.
- JWT Token Usage – Protect routes using accessToken and refreshToken.
- Refresh Token Mechanism – Supports token renewal for persistent sessions.
- Change Password – Users can securely change their passwords.
- Update User Profile – Modify user details such as avatar or bio.
- Watch History – Track and view previously watched videos.

### 🎬 Video Management
- Get All Videos – Retrieve a list of all uploaded videos.
- Publish Video with Thumbnail – Upload and publish videos with thumbnails (via Cloudinary).
- Toggle Video Publishing – Enable/disable video visibility.
- Get Video by ID – Fetch detailed video information.
- Update & Delete Videos – Full video management support.

### 🔔 Subscriptions
- Toggle Subscriptions – Subscribe/unsubscribe to channels.
- Subscribers List – View subscribers of a channel.
- Channels Subscribed By User – View user’s subscribed channels.

### 👍 Likes
- Toggle Likes – Like/unlike videos, comments, and tweets.
- Get Liked Videos – View all liked videos of a user.

### 💬 Comments
- Get All Comments for a Video – Fetch all related comments.
- Add, Update & Delete Comments – Interact with videos via comments.

### 🐦 Tweets
- CRUD Operations – Create, Read, Update, Delete tweets to engage users.

### 📺 Playlist Management
- Playlist CRUD – Create and manage playlists.
- Add & Remove Videos – Manage videos within playlists.

### 📊 Dashboard
- Get Channel Status – View basic channel analytics.
- Get Full Channel Details – Access in-depth channel insights.

## 🧩 Dependencies
- Package: Description
- bcrypt: Password hashing
- cloudinary: Cloud media storage
- cookie-parser: Cookie parsing middleware
- cors: Enable cross-origin requests
- dotenv: Environment variable loader
- express: Web server framework
- jsonwebtoken: JWT handling for auth
- mongoose: MongoDB ODM
- mongoose-aggregate-paginate-v2: Pagination for aggregate pipelines
- multer: File upload middleware


## 👨‍💻 Author
Abdul Makdoom

Feel free to explore and contribute to the VideoTube full-stack project. Happy coding! 🚀


