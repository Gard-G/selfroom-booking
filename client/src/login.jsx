import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !Password) {
      alert('Please fill in both fields');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/login', { username, Password });
      const { token, IDstatus } = response.data; // Extract token and IDstatus from response

      localStorage.setItem('token', token);
      localStorage.setItem('username', username); // Store the username
      localStorage.setItem('IDstatus', IDstatus); // Store the IDstatus

      window.location.href = '/status-orders'; // Redirect to status orders page
    } catch (error) {
      alert('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-5 my-5 bg-dark text-white rounded">
      <div className="card-header">
      <h2>Login</h2>
      </div>
        <div className="card-body">
          <div className="form-group mb-3">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            className="form-control"
            placeholder="Enter your username"
            value={username}
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
    </div>
  );
}

export default LoginPage;
