import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './components/homepage';
import LoginPage from './components/user/Login';
import SignupPage from './components/user/Signup';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const userData = response.data;
      // console.log(userData);
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setIsLoggedIn(false);
      localStorage.removeItem('token');
    }
  };

  const loginHandler = async (email, password) => {
    const userData = {
      email,
      password,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', userData);
      const { token } = response.data;

      localStorage.setItem('token', token);

      await fetchUserData(token);

      window.location.href = '/';
    } catch (error) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
  };

  const logoutHandler = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log(`token ${token}`);

      const response = await axios.post('http://localhost:5000/api/auth/logout', null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        localStorage.removeItem('token');
        setUser(null);
        setIsLoggedIn(false);
        window.location.href = '/';
      } else {
        console.error('Logout failed:', response.data.message);
      }
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Homepage user={isLoggedIn ? user : ""} isLoggedIn={isLoggedIn} logoutHandler={logoutHandler} />}
        />
        <Route
          path="/login"
          element={<LoginPage loginHandler={loginHandler} />}
        />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
