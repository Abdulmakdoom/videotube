import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom'
import App from './App.jsx'
// import { PersistGate } from "redux-persist/integration/react";
import store,{ persistor }  from './store/store.js'
import { Provider } from 'react-redux'
import {VideoPlay, 
  Login, Signup, Mainpage, History, ChannelProfile, 
  PlaylistProfile, PlaylistPage, Subscribers, YourVideos, 
  OwnerAllPlaylist, PublishVideo, EditVideo, 
  UpdatePlaylist, PostProfile, OwnerAllPosts, PublishPost, SubscriberPost, 
  PublishPlaylist, AccountEdit, PasswordEdit, PageNotFound, SearchPage
  // AddVideoInPlaylist
} from "./pages/allpage.js"

// import { useSelector } from 'react-redux'
import OwnerAllVideos from "../src/pages/OwnerAllVideos.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "*",
        element: <PageNotFound/>
      },
      {
        path: "/search/videos/:topic",
        element: <SearchPage/>
      },
      {
        path: "/signup",
        element: <Signup/>
      },
      {
        path: "/login",
        element: <Login/>
      },
      {
        path: "/home",
        element: <Mainpage/>
      },
      {
        path: "/", // Redirect root to /home
        element: <Navigate to="/home" replace />,
      },
      {
        path: "/home/videos/:videoId",
        element: <VideoPlay/>
      },
      {
        path: "/home/history",
        element: <History/>
      },
      {
        path: "/:username",
        element: <ChannelProfile/>
      },
      {
        path: "/:username/playlist",
        element: <PlaylistProfile/>
      },
      {
        path: "/playlist/:playlistId",
        element: <PlaylistPage/>
      },
      {
        path: "/subscriptions",
        element: <Subscribers/>
      },
      {
        path: "/videos",
        element: <YourVideos/>
      },
      {
        path: "/posts",
        element: <SubscriberPost/>
      }, 
      {
        path: "/videos/:userId",
        element: <OwnerAllVideos/>
      },
      {
        path: "/videos/playlist/:userId",
        element: <OwnerAllPlaylist/>
      },
      {
        path: "/home/videos/publish",
        element: <PublishVideo/>
      },
      {
        path: "/home/posts/publish",
        element: <PublishPost/>
      },
      {
        path: "/home/playlist/publish",
        element: <PublishPlaylist/>
      },
      {
        path: "/home/videos/edit/:videoId",
        element: <EditVideo/>
      },
      {
        path: "/:username/edit",
        element: <AccountEdit/>
      },
      {
        path: "/:username/password/edit",
        element: <PasswordEdit/>
      },
      {
        path: "/playlist/edit/:playlistId",
        element: <UpdatePlaylist/>
      },
      {
        path: "/:username/post",
        element: <PostProfile/>
      },
      {
        path: "/posts/:userId",
        element: <OwnerAllPosts/>
      }

    ]
  }
]) 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
        <RouterProvider router={router}/>
      {/* </PersistGate> */}
    </Provider>
  </StrictMode>,
)
