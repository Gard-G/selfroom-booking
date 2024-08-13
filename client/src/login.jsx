import React, { useState } from 'react';
import axios from 'axios';

function LoginPage() {
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', { Username, Password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', Username); // Store the username
      window.location.href = '/status-orders'; // Redirect to status orders page
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={Username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={Password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;
