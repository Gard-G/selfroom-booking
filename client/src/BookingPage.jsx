import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [roomID, setRoomID] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');

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
      Name: name,
      Phone: phone,
      Reason: reason
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
      <div className="container p-5 my-5 bg-dark text-white">
      <br />
      <form onSubmit={handleSubmit}>
        <label style={{marginRight: '15px'}}>
          Room:
          <select value={roomID} onChange={(e) => setRoomID(e.target.value)}>
            <option value="">Select Room</option>
            {rooms.map(room => (
              <option key={room.RoomID} value={room.RoomID}>{room.RoomName}</option>
            ))}
          </select>
        </label>
        
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <br />
        <br />
        <label style={{marginRight: '10px'}}>
          Start Time:
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
        

        <label >
          End Time:
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
        <br />
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
        <br />
        <label>
          Phone: 
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
        <br />
        <br />
        <label>
          Reason: 
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </label>
        <br />
        <br />
        <button type="submit" class="btn btn-outline-success" >Book Room</button>
      </form>
      </div>
    </div>
  );
};

export default BookingPage;
