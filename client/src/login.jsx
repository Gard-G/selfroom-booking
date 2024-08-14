import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function LoginPage() {
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!Username || !Password) {
      alert('Please fill in both fields');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/login', { Username, Password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', Username); // Store the username
      window.location.href = '/status-orders'; // Redirect to status orders page
    } catch (error) {
      alert('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <div className="container p-5 my-5 bg-dark text-white rounded">
        <div className="form-group mb-3">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            className="form-control"
            placeholder="Enter your username"
            value={Username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Enter your password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <button 
            className="btn btn-outline-success btn-block" 
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
