import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/nevbar';
import { useLocation, useNavigate } from 'react-router-dom';

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
    axios.get(`/api/rooms-with-bookings?center=${selectedCenter}`)
      .then(response => {
        setRooms(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching rooms with bookings:', error);
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
          <div className="col-md-6 mb-4" key={room.RoomID}>
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">{room.RoomName}</h3>
                <p className="card-text">อุปกรณ์ในห้อง: {room.DetailRoom}</p>
                
                {/* Display bookings if available */}
                {room.bookings && room.bookings.length > 0 ? (
                  <div>
                    <h5>การจอง:</h5>
                    
                      {room.bookings.map((booking, index) => (
                        <li key={index}>
                          {new Date(booking.Start).toLocaleDateString()} 
                          -เวลา {new Date(booking.Start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })} 
                          - {new Date(booking.End).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                        </li>
                      ))}
                    
                  </div>
                ) : (
                  <p>ไม่มีการจองสำหรับห้องนี้</p>
                )}

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
