import React from 'react'
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Workspace from './pages/Workspace';
import FormBot from './pages/FormBot';
import Response from './pages/Response';


function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/home" element={<Home />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/workspace" element={<Workspace />} />
      <Route path="/formbot/:formId" element={<FormBot />} />
      <Route path="/response/:formId" element={<Response />} />
    </Routes>
  )
}

export default App
