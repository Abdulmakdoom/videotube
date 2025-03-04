import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Login'
import { Outlet } from 'react-router-dom'
import Footer from './pages/Footer'
import Header from './pages/Header'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header/>
    <main>
      <Outlet/>
    </main>
    <Footer/>
    </>
  )
}

export default App
