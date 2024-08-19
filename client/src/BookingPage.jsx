import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/nevbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const BookingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [roomCenters, setRoomCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [roomID, setRoomID] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to log in first');
      window.location.href = '/login';
      return;
    }

    // Fetch all rooms
    axios.get('http://localhost:5000/api/rooms')
      .then(response => {
        const allRooms = response.data;
        setRooms(allRooms);
        const centers = Array.from(new Set(allRooms.map(room => room.RoomCenter)));
        setRoomCenters(centers);
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
      });
  }, []);

  const handleCenterChange = (e) => {
    const selectedCenter = e.target.value;
    setSelectedCenter(selectedCenter);
    const filtered = rooms.filter(room => room.RoomCenter === selectedCenter);
    setFilteredRooms(filtered);
    setRoomID(''); // Reset the room selection when center changes
  };

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
        alert('Booking created successfully');
        // Reset form fields after successful booking
        setRoomID('');
        setDate('');
        setStartTime('');
        setEndTime('');
        setName('');
        setPhone('');
        setReason('');
      })
      .catch(error => {
        console.error('Error creating booking:', error.response ? error.response.data : error.message);
        alert('Failed to create booking.');
      });
  };

  return (
    <div className='container' >
      <Navbar />
      <div className="container card p-5 my-5 bg-dark text-white rounded" style={{ marginTop: '20px' }}>
      <div className="card-header">
        <h1>Booking Page</h1>
      </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
              <div className='form-group mb-3'>
                <label htmlFor="center">Room Center:</label>
                <select
                  id="center"
                  className="form-control"
                  value={selectedCenter}
                  onChange={handleCenterChange}
                >
                  <option value="">Select Center</option>
                  {roomCenters.map(center => (
                    <option key={center} value={center}>
                      {center}
                    </option>
                  ))}
                </select>
              </div>
            
              <div className='form-group mb-3'>
                <label htmlFor="room">Room:</label>
                <select
                  id="room"
                  className="form-control"
                  value={roomID}
                  onChange={(e) => setRoomID(e.target.value)}
                  disabled={!selectedCenter} // Disable if no center is selected
                >
                  <option value="">Select Room</option>
                  {filteredRooms.map(room => (
                    <option key={room.RoomID} value={room.RoomID}>{room.RoomName}</option>
                  ))}
                </select>
              </div>

              <div className='form-group mb-3'>
                <label htmlFor="date">Date:</label>
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
                <label htmlFor="startTime">Start Time:</label>
                <input
                  id="startTime"
                  type="time"
                  className="form-control"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="form-group mb-3 col-lg-6 col-12">
                <label htmlFor="endTime">End Time:</label>
                <input
                  id="endTime"
                  type="time"
                  className="form-control"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="name">Name:</label>
                <input
                  id="name"
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="phone">Phone:</label>
              <input
                id="phone"
                type="text"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="reason">Reason:</label>
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
      </div>
    </div>
  );
};

export default BookingPage;
