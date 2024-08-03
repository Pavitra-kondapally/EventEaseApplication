// client/src/components/Login.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './Login.css'; // Import CSS for styling

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const message = queryParams.get('message');
    if (message === 'login') {
      setMessage('Please log in to view your events.');
    }
  }, [location.search]);

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', { username, password });
      localStorage.setItem('token', response.data.token);
      setSuccess('Logged in successfully');
      setError('');
      navigate('/events'); // Redirect to events page or any other page
    } catch (error) {
      setError(error.response?.data?.error || error.message);
      setSuccess('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setSuccess('Logged out successfully');
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {message && <p className="info-message">{message}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout} className="logout-button">Logout</button>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default Login;
