import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const storedUsername = localStorage.getItem('username');
      const storedStatus = localStorage.getItem('IDstatus'); // Assuming you store the user's status in localStorage
      if (storedUsername) {
        setUsername(storedUsername);
      }
      if (storedStatus === 'admin') {
        setIsAdmin(true);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('IDstatus');
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.location.href = '/';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container">
        <a className="navbar-brand" href="//rmutp.ac.th">RMUTP</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item active">
              <a className="nav-link" href="/">หน้าแรก</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/booking">จองห้อง</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/status-orders">รายการจอง</a>
            </li>
            {isAdmin && (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/approve">ลงนาม/อนุมัติ</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/add-rooms">เพิ่มห้อง</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/User-Manage">จัดการuser</a>
                </li>
              </>
            )}
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
