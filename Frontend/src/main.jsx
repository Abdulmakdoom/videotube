import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom'
import App from './App.jsx'
import { PersistGate } from "redux-persist/integration/react";
import store,{ persistor }  from './store/store.js'
import { Provider } from 'react-redux'
import {VideoPlay, Login, Signup, Mainpage, History} from "./pages/allpage.js"

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
      {
        path: "/home/history",
        element: <History/>
      }
    ]
  }
]) 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router}/>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
