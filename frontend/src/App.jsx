import React from 'react'
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Settings from './pages/Settings';


function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/home" element={<Home />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}

export default App
