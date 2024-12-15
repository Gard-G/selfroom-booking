import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/nevbar';

const ApprovePage = () => {
  const [bookings, setBookings] = useState([]);
  const [reason, setReason] = useState('');
  const [currentBooking, setCurrentBooking] = useState(null); // เก็บข้อมูลการจองที่กำลังจะถูกปฏิเสธ
  const [showModal, setShowModal] = useState(false); // ควบคุมการแสดง modal
  const navigate = useNavigate();

  useEffect(() => {
      // เปลี่ยน place-items ของ body เมื่อเข้าไปในหน้า StatusOrderPage
      document.body.style.placeItems = 'start'; // place-items: start; แทน top
  
      // คืนค่าการตั้งค่าเดิมเมื่อออกจากหน้า
      return () => {
        document.body.style.placeItems = ''; // คืนค่ากลับเป็นค่าเดิม
      };
    }, []);

  useEffect(() => {
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

  const handleUpdateStatus = (OrderBooking, newStatus, reason) => {
    axios.put('/api/update-booking-status', { OrderBooking, newStatus, reason })
      .then(response => {
        setBookings(bookings.filter(booking => booking.OrderBooking !== OrderBooking));
        setShowModal(false);
        setReason('');
        setCurrentBooking(null);
      })
      .catch(error => {
        console.error('Error updating booking status:', error);
      });
  };

  const openRejectModal = (booking) => {
    setCurrentBooking(booking);
    setShowModal(true);
  };

  const closeRejectModal = () => {
    setShowModal(false);
    setReason('');
    setCurrentBooking(null);
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
                <th>วันที่เริ่มจอง</th>
                <th>วันที่สิ้นสุด</th>
                <th>ชื่อห้อง</th>
                <th>เวลาเริ่ม</th>
                <th>ถึงเวลา</th>
                <th>เบอร์โทร</th>
                <th>วัตถุประสงค์</th>
                <th></th>
              </tr>
            </thead>
            <tbody className='table-info'>
              {bookings.map(booking => (
                <tr key={booking.OrderBooking}>
                  <td>{booking.Name}</td>
                  <td>{new Date(booking.StartDate).toLocaleDateString('th-TH', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}</td>
                  <td>{new Date(booking.EndDate).toLocaleDateString('th-TH', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}</td>
                  <td>{booking.RoomName}</td>
                  <td>{new Date(`1970-01-01T${booking.Start}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).replace(":", ".")}</td>
                  <td>{new Date(`1970-01-01T${booking.End}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).replace(":", ".")}</td>
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
                      onClick={() => openRejectModal(booking)}
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

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">ปฏิเสธการจอง</h5>
                <button type="button" className="close" onClick={closeRejectModal}>&times;</button>
              </div>
              <div className="modal-body">
                <p>กรุณาระบุเหตุผลในการปฏิเสธ:</p>
                <textarea
                  className="form-control"
                  rows="3"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleUpdateStatus(currentBooking.OrderBooking, 'reject', reason)}
                  disabled={!reason.trim()}
                >
                  ยืนยัน
                </button>
                <button type="button" className="btn btn-secondary" onClick={closeRejectModal}>ยกเลิก</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovePage;
