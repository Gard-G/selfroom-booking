import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/nevbar';

const AddRoomPage = () => {
  const [roomName, setRoomName] = useState('');
  const [roomCenter, setRoomCenter] = useState('');
  const [centers, setCenters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user-info', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data.IDstatus !== 'admin') {
          alert('Access denied: Admins only');
          navigate('/'); // Redirect to home or login
        }
      } catch (error) {
        console.error('Error verifying user status:', error);
        navigate('/'); // Redirect to home or login
      }
    };

    const fetchCenters = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/room-centers');
        setCenters(response.data);
      } catch (error) {
        console.error('Error fetching room centers:', error);
      }
    };

    checkAdminStatus();
    fetchCenters();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/add-room',
        { RoomName: roomName, RoomCenter: roomCenter },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Room added successfully!');
      setRoomName('');
      setRoomCenter('');
    } catch (error) {
      console.error('Error adding room:', error);
      alert('Failed to add room.');
    }
  };

  return (
    <div className="container mt-5">
        <Navbar />
      <div className="card p-5 my-5 bg-dark text-white rounded">
        <div className="card-header">
          <h2>เพิ่มห้อง</h2>
        </div>
        <div className="card-body ">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="roomName">ชื่อห้อง:</label>
              <input
                id="roomName"
                type="text"
                className="form-control"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="roomCenter">ศูนย์:</label>
              <select
                id="roomCenter"
                className="form-control"
                value={roomCenter}
                onChange={(e) => setRoomCenter(e.target.value)}
              >
                <option value="">เลือกศูนย์</option>
                {centers.map((center) => (
                  <option key={center} value={center}>
                    {center}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-outline-success btn-block">Add Room</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRoomPage;
