import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import styles from './pagesModuleCSS/SignIn.module.css';

function SignIn() {
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL; 
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Toggle between Sign Up and Sign In forms
  const handleToggle = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
  };

  // Handle form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isSignUp) {
      setSignUpData({ ...signUpData, [name]: value });
    } else {
      setLoginData({ ...loginData, [name]: value });
    }
  };

  // Handle Sign In/Sign Up
  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    try {
      if (isSignUp) {
        // Sign-Up logic
        const { username, email, password, confirmPassword } = signUpData;

        if (!username || !email || !password || !confirmPassword) {
          setError('All fields are required.');
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          return;
        }

        const response = await axios.post(`${backendURL}/api/user/register`, {
          username,
          email,
          password,
        });

        if (response.data.success) {
          setSuccess('Sign-up successful!');
          localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user data
          navigate('/home');
        } else {
          setError(response.data.message || 'Registration failed.');
        }
      } else {
        // Login logic
        const { email, password } = loginData;

        if (!email || !password) {
          setError('Both fields are required.');
          return;
        }

        const response = await axios.post(`${backendURL}/api/user/login`, {
          email,
          password,
        });

        if (response.data.success) {

          setSuccess('Login successful!');
          localStorage.setItem('authToken', response.data.token); 
          // localStorage.setItem('userName', response.data.user.username);
          localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user object
          localStorage.setItem('token', response.data.token); // Store token
          console.log('Before navigation to /home');
        
        // navigate('/home');
              
          console.log("cross the navigate(/home)")
          // Fetch protected data after login
          fetchProtectedData(response.data.token);
          navigate('/home',{ state: { isAuthenticated: true } });
        } 
        else {
          setError(response.data.message || 'Invalid credentials.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }

  };


  // Function to fetch protected data after login
  const fetchProtectedData = (token) => {
    axios
      .get(`${backendURL}/api/protected`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in header
        },
      })
      .then((response) => {
        console.log('Protected Data:', response.data); // Handle the response from the protected route
      })
      .catch((error) => {
        console.error('Failed to fetch protected data:', error.message);
      });
  };


  return (
    <div className={styles.mainContainer}>
      <div onClick={() => navigate('/')} className={styles.arrowDiv}><FaArrowLeft /></div>
      <div className={styles.loginNSignUpDiv}>
      <img src="./assets/Group2.png" alt="" />
      <div>
        <div className={styles.signInNCircleDiv}>
        <div className={styles.signForm}>
          {isSignUp ? (
            <div className={styles.inputs}>
              <p>Username</p>
              <input
                type="text"
                name="username"
                value={signUpData.username}
                onChange={handleChange}
                placeholder="Enter your username"
              />
              <p>Email</p>
              <input
                type="email"
                name="email"
                value={signUpData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              <p>Password</p>
              <input
                type="password"
                name="password"
                value={signUpData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <p>Confirm Password</p>
              <input
                type="password"
                name="confirmPassword"
                value={signUpData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
            </div>
          ) : (
            <div className={styles.inputs}>
              <p>Email</p>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              <p>Password</p>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>
          )}
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          <button className={styles.submitButton} onClick={handleSubmit}>{isSignUp ? 'Sign Up' : 'Log In'}</button>
          <span id={styles.orSpan}>OR</span>
          <button id={styles.signUpWithGoogle}><span><FcGoogle id={styles.googleIcon}/></span>Sign Up with Google</button>
          <p>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <span onClick={handleToggle} className={styles.toggleLink}>
              {isSignUp ? 'Log in' : 'Register now'}
            </span>
          </p>
          </div>
          <div className={styles.bottomImageDiv}>
          <img className={styles.bottomImage}  src="./assets/Ellipse1.png" alt="" />
          </div>
        </div>
        </div>
        <img src="./assets/Ellipse2.png" alt="" />
      </div>
    </div>
  );
}

export default SignIn;

