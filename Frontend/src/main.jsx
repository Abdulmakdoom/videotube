import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom'
import App from './App.jsx'
import store from './store/store.js'
import { Provider } from 'react-redux'
import {VideoPlay, Login, Signup, Mainpage} from "./pages/allpage.js"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
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
      // {
      //   path: "/",
      //   element: <Mainpage/>
      // }
      {
        path: "/home/videos/:videoId",
        element: <VideoPlay/>
      },
    ]
  }
]) 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
  </StrictMode>,
)
