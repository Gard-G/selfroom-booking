import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/nevbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const RoomDetailsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const selectedCenter = queryParams.get('center');

  useEffect(() => {
    // Fetch rooms based on the selected center
    console.log('Selected Center:', selectedCenter); // Debugging statement
    axios.get(`/api/rooms?center=${selectedCenter}`)
      .then(response => {
        setRooms(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
        setLoading(false);
      });
  }, [selectedCenter]);

  const handleRoomSelect = (roomID) => {
    navigate(`/booking?center=${selectedCenter}&room=${roomID}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <Navbar />
      <h1>Available Rooms at {selectedCenter}</h1>
      <div className="row">
        {rooms.map(room => (
          <div className="col-md-4 mb-4" key={room.RoomID}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{room.RoomName}</h5>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleRoomSelect(room.RoomID)}
                >
                  Select Room
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomDetailsPage;
