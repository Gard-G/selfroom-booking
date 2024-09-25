// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import BookingPage from './BookingPage';
import ApprovePage from './ApprovePage';
import Login from './login';
import StatusOrderPage from './StatusOrderPage';
import AddRoomPage from './AddRoom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import UserManagement from './UManage';
import SelectCenterPage from './SelectCenterPage';
import Testapp from './test';
import RoomDetailsPage from './RoomDetailsPage';
import AdminManagementPage from './AdminManagementPage';
const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/approve" element={<ApprovePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/status-orders" element={<StatusOrderPage />} />
        <Route path="/add-rooms" element={<AddRoomPage />} />
        <Route path="/select-rooms" element={<RoomDetailsPage />} />
        <Route path="/SelectCenter" element={<SelectCenterPage />} />
        <Route path="/testapp" element={<Testapp />} />
        <Route path="/Admin-manage" element={<AdminManagementPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
