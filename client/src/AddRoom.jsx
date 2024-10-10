import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/nevbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddRoomPage = () => {
  const [roomName, setRoomName] = useState('');
  const [roomCenter, setRoomCenter] = useState('');
  const [detailRoom, setDetailRoom] = useState('');
  const [image, setImage] = useState(null);
  const [centers, setCenters] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [editRoomId, setEditRoomId] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Create a ref for the file input

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await axios.get('/api/user-info', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data.IDstatus !== 'admin') {
          toast.error('Access denied: Admins only');
          navigate('/');
        }
      } catch (error) {
        console.error('Error verifying user status:', error);
        navigate('/');
      }
    };

    const fetchCenters = async () => {
      try {
        const response = await axios.get('/api/room-centers');
        setCenters(response.data);
      } catch (error) {
        console.error('Error fetching room centers:', error);
      }
    };

    const fetchRooms = async () => {
      try {
        const response = await axios.get('/api/rooms-all');
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    checkAdminStatus();
    fetchCenters();
    fetchRooms();
  }, [navigate]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('RoomName', roomName);
      formData.append('RoomCenter', roomCenter);
      formData.append('DetailRoom', detailRoom);
      if (image) {
        formData.append('Image', image);
      }
  
      const token = localStorage.getItem('token');
  
      if (editRoomId) {
        const response = await axios.put(`/api/edit-room/${editRoomId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (response.status === 200) {
          toast.success('Room updated successfully!');
  
          // Update the rooms state to reflect the edited room
          setRooms(prevRooms =>
            prevRooms.map(room => room.RoomID === editRoomId ? {
              ...room,
              RoomName: roomName,
              RoomCenter: roomCenter,
              DetailRoom: detailRoom,
              Image: image ? image.name : room.Image,
            } : room)
          );
  
          resetForm();
        } else {
          toast.error('Failed to update room. Please try again.');
        }
      } else {
        const response = await axios.post('/api/add-room', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (response.status === 200) {
          toast.success('Room added successfully!');
          
          // Ensure that response.data contains the new room details
          const newRoom = response.data; // Assume this is the new room object
          
          // Directly append the new room object received from the server
          setRooms(prevRooms => [...prevRooms, newRoom]);
  
          resetForm();
        } else {
          toast.error('Failed to add room. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error saving room:', error);
      toast.error('Failed to save room. Please check your inputs and try again.');
    }
  };
  
  const resetForm = () => {
    setRoomName('');
    setRoomCenter('');
    setDetailRoom('');
    setImage(null);
    setEditRoomId(null); // Reset edit room ID for adding new room
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the file input
    }
  };
  
  const handleEditRoom = (room) => {
    setRoomName(room.RoomName);
    setRoomCenter(room.RoomCenter);
    setDetailRoom(room.DetailRoom);
    setEditRoomId(room.RoomID);
  };

  const handleDeleteRoom = async (roomId) => {
    const confirmed = window.confirm('Are you sure you want to delete this room?');
    if (confirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`/api/delete-room/${roomId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          toast.success('Room deleted successfully!');
          setRooms(rooms.filter((room) => room.RoomID !== roomId));
        } else {
          toast.error('Failed to delete room. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting room:', error);
        toast.error('Failed to delete room. Please try again.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <Navbar />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="card p-5 my-5 bg-dark text-white rounded">
        <div className="card-header">
          <h2>{editRoomId ? 'แก้ไขห้อง' : 'เพิ่มห้อง'}</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="roomName">ชื่อห้อง:</label>
              <input
                id="roomName"
                type="text"
                className="form-control"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="roomCenter">ศูนย์:</label>
              <select
                id="roomCenter"
                className="form-control"
                value={roomCenter}
                onChange={(e) => setRoomCenter(e.target.value)}
                required
              >
                <option value="">เลือกศูนย์</option>
                {centers.map((center) => (
                  <option key={center} value={center}>
                    {center}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group mb-3">
              <label htmlFor="detailRoom">รายละเอียดห้อง:</label>
              <textarea
                id="detailRoom"
                className="form-control"
                value={detailRoom}
                onChange={(e) => setDetailRoom(e.target.value)}
                rows="3"
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="image">รูปห้อง:</label>
              <input
                ref={fileInputRef} // Attach the ref to the file input
                id="image"
                type="file"
                className="form-control"
                onChange={handleImageChange}
              />
            </div>
            <button type="submit" className="btn btn-outline-success btn-block">
              {editRoomId ? 'Update Room' : 'Add Room'}
            </button>
          </form>
        </div>
      </div>

      <div className="card p-5 my-5 bg-dark text-white rounded">
        <h2>รายการห้อง</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ชื่อห้อง</th>
              <th>ศูนย์</th>
              <th>รายละเอียดห้อง</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.RoomID}>
                <td>{room.RoomName}</td>
                <td>{room.RoomCenter}</td>
                <td>{room.DetailRoom}</td>
                <td>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleEditRoom(room)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteRoom(room.RoomID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddRoomPage;
