import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [roomID, setRoomID] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/rooms')
      .then(response => {
        setRooms(response.data);
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
      });
  }, []);



  const handleSubmit = (event) => {
    event.preventDefault();
    const startDateTime = `${date} ${startTime}`;
    const endDateTime = `${date} ${endTime}`;
    
    axios.post('http://localhost:5000/api/bookings', {
      RoomID: roomID,
      Date: date,
      Start: startDateTime,
      End: endDateTime,
      Name: name
    })
    .then(response => {
      alert('Booking created successfully');
    })
    .catch(error => {
      console.error('Error creating booking:', error.response ? error.response.data : error.message);
      alert('Failed to create booking.');
    });
  };
  

  return (
    <div>
      <h1>Booking Page</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Room:
          <select value={roomID} onChange={(e) => setRoomID(e.target.value)}>
            <option value="">Select Room</option>
            {rooms.map(room => (
              <option key={room.RoomID} value={room.RoomID}>{room.RoomName}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <br />
        <label>
          Start Time:
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
        <br />
        <label>
          End Time:
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
        <br />
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Book Room</button>
      </form>
    </div>
  );
};

export default BookingPage;
