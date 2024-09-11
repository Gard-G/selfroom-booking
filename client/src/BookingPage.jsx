import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/nevbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const BookingPage = () => {
  const [room, setRoom] = useState(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const selectedCenter = queryParams.get('center');
  const selectedRoomID = queryParams.get('room');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/rooms/${selectedRoomID}`)
      .then(response => {
        setRoom(response.data);
      })
      .catch(error => {
        console.error('Error fetching room details:', error);
      });
  }, [selectedRoomID]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!date || !startTime || !endTime || !name || !phone || !reason) {
      handleShowModal('Please fill in all fields.');
      return;
    }

    const token = localStorage.getItem('token');
    const startDateTime = `${date} ${startTime}`;
    const endDateTime = `${date} ${endTime}`;

    axios.post('http://localhost:5000/api/bookings', {
      RoomID: selectedRoomID,
      Date: date,
      Start: startDateTime,
      End: endDateTime,
      Name: name,
      Phone: phone,
      Reason: reason
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => {
        handleShowModal('Booking created successfully');
      })
      .catch(error => {
        console.error('Error creating booking:', error.response ? error.response.data : error.message);
        handleShowModal('Failed to create booking.');
      });
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (message) => {
    setModalContent(message);
    setShowModal(true);
  };

  return (
    <div className="container">
      <Navbar />
      <div className='mb-5'></div>
      <div className='card  bg-dark text-white'>
      <h1 className="mt-4 mb-4">จองห้อง {room ? room.RoomName : ''}</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group mb-3'>
          <label htmlFor="date">วันที่:</label>
          <input
            id="date"
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className='row'>
          <div className="form-group mb-3 col-lg-6 col-12">
            <label htmlFor="startTime">เวลาเริ่ม:</label>
            <input
              id="startTime"
              type="time"
              className="form-control"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="form-group mb-3 col-lg-6 col-12">
            <label htmlFor="endTime">จนถึง:</label>
            <input
              id="endTime"
              type="time"
              className="form-control"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group mb-3">
          <label htmlFor="name">ชื่อ-นามสกุล:</label>
          <input
            id="name"
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="phone">เบอร์โทร:</label>
          <input
            id="phone"
            type="text"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="form-group mb-4">
          <label htmlFor="reason">ใช้ทำอะไร:</label>
          <textarea
            id="reason"
            className="form-control"
            rows="3"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-success btn-block">
          Book Room
        </button>
      </form>

      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content bg-success text-white">
              <div className="modal-header">
                <h5 className="modal-title">Notification</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                {modalContent}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" onClick={handleCloseModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default BookingPage;
