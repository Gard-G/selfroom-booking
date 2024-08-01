// Navbar.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar() {
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
              <a className="nav-link" href="/">เข้าสู่ระบบ</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
