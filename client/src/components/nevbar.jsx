import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Check if the user is logged in by checking localStorage for the token
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    window.location.href = '/'; // Redirect to homepage after logout
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top d-print-none">
      <div className="container">
        <a className="navbar-brand fontTH" href="//rmutp.ac.th">RMUTP</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse fontTH" id="navbarResponsive">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item active">
              <a className="nav-link" href="/">
                หน้าแรก
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/booking">จองห้อง</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/approve">ลงนาม/อนุมัติ</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/status-orders">รายการจอง</a>
            </li>
            {isLoggedIn ? (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {username}
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><a className="dropdown-item" href="#" onClick={handleLogout}>Log Out</a></li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <a className="nav-link" href="/login">เข้าสู่ระบบ</a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
