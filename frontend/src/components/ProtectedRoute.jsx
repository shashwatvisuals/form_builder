import React from 'react';
import { Navigate } from 'react-router-dom';

// ProtectedRoute Component
const ProtectedRoute = ({ children }) => {
  // Check if the user is authenticated by checking the token in localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  
  if (!user || !token) {
    // If no user or token found, redirect to login
    return <Navigate to="/signin" replace />;
  }
  
  // If authenticated, render the child components (protected routes)
  return children;
};

export default ProtectedRoute;
