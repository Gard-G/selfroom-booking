import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/nevbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useLocation, useNavigate } from 'react-router-dom';

const BookingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [roomID, setRoomID] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Add state to check if user is logged in
  const navigate = useNavigate(); // Use navigate for redirection

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCenter = queryParams.get('center'); // Read selected center from URL

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      navigate('/login'); // Redirect to login if not logged in
      return;
    }

    // Fetch all rooms
    axios.get('http://localhost:5000/api/rooms')
      .then(response => {
        const allRooms = response.data;
        setRooms(allRooms);
        const filtered = allRooms.filter(room => room.RoomCenter === selectedCenter);
        setFilteredRooms(filtered);
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
      });
  }, [selectedCenter, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!roomID || !date || !startTime || !endTime || !name || !phone || !reason) {
      alert('Please fill in all fields.');
      return;
    }

    const token = localStorage.getItem('token');
    const startDateTime = `${date} ${startTime}`;
    const endDateTime = `${date} ${endTime}`;

    axios.post('http://localhost:5000/api/bookings', {
      RoomID: roomID,
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
      .then(response => {
        // Reset form fields after successful booking
        setRoomID('');
        setDate('');
        setStartTime('');
        setEndTime('');
        setName('');
        setPhone('');
        setReason('');
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
    <div className='container'>
      <Navbar />
      <div className="card card-container bg-dark text-white rounded">
        <div className="card-header">
          <h2>จองห้อง {selectedCenter}</h2> {/* Display the selected center */}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className='form-group mb-3'>
              <label htmlFor="room">ห้อง:</label>
              <select
                id="room"
                className="form-control"
                value={roomID}
                onChange={(e) => setRoomID(e.target.value)}
              >
                <option value="">เลือกห้อง</option>
                {filteredRooms.map(room => (
                  <option key={room.RoomID} value={room.RoomID}>{room.RoomName}</option>
                ))}
              </select>
            </div>

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
                <label htmlFor="endTime">ถึงเวลา:</label>
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

            <button type="submit" className="btn btn-outline-success btn-block">
              Book Room
            </button>
          </form>
        </div>
        {showModal && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content bg-success">
                <div className="modal-header">
                  <h5 className="modal-title">Notification</h5>
                  <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                </div>
                <div className="modal-body">
                  {modalContent}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
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
