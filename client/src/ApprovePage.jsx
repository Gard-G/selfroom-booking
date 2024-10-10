import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/nevbar';

const ApprovePage = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user info to check if the user is an admin
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to log in first');
      navigate('/login');
      return;
    }

    axios.get('/api/user-info', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.data.IDstatus !== 'admin') {
        alert('Access denied: Admins only');
        navigate('/');
      } else {
        // Fetch bookings for approval
        axios.get('/api/wait-bookings')
          .then(response => {
            setBookings(response.data);
          })
          .catch(error => {
            console.error('Error fetching bookings:', error);
          });
      }
    })
    .catch(error => {
      console.error('Error fetching user info:', error);
      alert('Failed to verify user status.');
      navigate('/');
    });
  }, [navigate]);

  const handleUpdateStatus = (OrderBooking, newStatus) => {
    axios.put('/api/update-booking-status', { OrderBooking, newStatus })
      .then(response => {
        setBookings(bookings.filter(booking => booking.OrderBooking !== OrderBooking));
      })
      .catch(error => {
        console.error('Error updating booking status:', error);
      });
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h1>อนุมัติรายการจอง</h1>
        <div className="table-responsive mt-4">
          <table className='table table-bordered '>
            <thead className='table-dark '>
              <tr style={{fontSize: '20px'}}>
                <th>ชื่อ-นามสกุล</th>
                <th>วันที่</th>
                <th>ชื่อห้อง</th>
                <th>เวลาเริ่ม</th>
                <th>ถึงเวลา</th>
                <th>เบอร์โทร</th>
                <th>ใช้ทำอะไร</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className='table-info'>
              {bookings.map(booking => (
                <tr key={booking.OrderBooking}>
                  <td>{booking.Name}</td>
                  <td>{booking.Date}</td>
                  <td>{booking.RoomName}</td>
                  <td>{booking.Start}</td>
                  <td>{booking.End}</td>
                  <td>{booking.Phone}</td>
                  <td>{booking.Reason}</td>
                  <td>
                    <button 
                      onClick={() => handleUpdateStatus(booking.OrderBooking, 'booking')}
                      className="btn btn-success me-2"
                    >
                      อนุมัติ
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(booking.OrderBooking, 'reject')}
                      className="btn btn-danger"
                    >
                      ปฏิเสธ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApprovePage;
