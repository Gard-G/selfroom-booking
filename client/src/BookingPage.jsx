import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/nevbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const BookingPage = () => {
  const [room, setRoom] = useState(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!date || !startTime || !endTime || !name || !phone || !reason) {
      toast.error('Please fill in all fields.');
      return;
    }

    const token = localStorage.getItem('token');
    const startDateTime = `${date} ${startTime}`;
    const endDateTime = `${date} ${endTime}`;

    try {
      const response = await axios.post('http://localhost:5000/api/bookings', {
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
      });
      toast.success(response.data);
    } catch (error) {
      console.error('Error creating booking:', error.response ? error.response.data : error.message);
      toast.error(error.response?.data || 'Failed to create booking.');
    }
  };

  return (
    <div className="container">
      <Navbar />
      <div className='mb-5'></div>
      <div className='card card-container bg-dark text-white'>
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
            <small>จองวันที่: {date ? `${date.split('-')[2]} เดือน${date.split('-')[1]} ปี${date.split('-')[0]}` : ''}</small>
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
            จองห้อง
          </button>
        </form>

        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </div>
    </div>
  );
};

export default BookingPage;
