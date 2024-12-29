import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../styles/LoginPage.css';
import logo from '../logo.png';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      });

      if (response.data.message === 'Login successful') {
        // Store user details in localStorage using the correct response structure
        localStorage.setItem('user_id', response.data.user.id);
        localStorage.setItem('role_id', response.data.user.role_id);
        localStorage.setItem('username', response.data.user.username);
        localStorage.setItem('name', response.data.user.name);

        console.log('Login successful, role_id:', response.data.user.role_id); // Debug log

        // Redirect based on role
        if (response.data.user.role_id === 1) {
          navigate('/admin-dashboard');
        } else if (response.data.user.role_id === 2) {
          navigate('/staff-dashboard');
        } else {
          setError('Invalid role type');
        }
      }
    } catch (err) {
      console.error('Login error:', err); // Debug log
      setError(err.response?.data?.message || 'Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="header">
        <img src={logo} alt="University Logo" />
        <h1>CAD Portal</h1>
        <p className="university-name">International University of Erbil</p>
      </div>

      <form className="login-form" onSubmit={handleLogin}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" className="login-btn">Login</button>
      </form>

      <div className="footer">
        <p>Project by Zaid Yasir, Hassan Haidar, and Rawand</p>
      </div>
    </div>
  );
};

export default LoginPage;