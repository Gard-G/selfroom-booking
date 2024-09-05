import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/nevbar';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const RoomDetailsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRoomIDs, setExpandedRoomIDs] = useState(new Set()); // Track expanded room IDs
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

  const toggleBookingDetails = (roomID) => {
    setExpandedRoomIDs(prevExpandedRoomIDs => {
      const newExpandedRoomIDs = new Set(prevExpandedRoomIDs);
      if (newExpandedRoomIDs.has(roomID)) {
        newExpandedRoomIDs.delete(roomID); // Hide details
      } else {
        newExpandedRoomIDs.add(roomID); // Show details
      }
      return newExpandedRoomIDs;
    });
  };

  if (loading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <Navbar />
      <div style={{width:'65vw'}}>
      <h1 className="mb-4">Available Rooms at {selectedCenter}</h1>
      <div className="row">
        {rooms.map(room => (
          <div className="col-md-6 mb-4" key={room.RoomID}>
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">{room.RoomName}</h3>
                <h6 className="card-text ">รายละเอียดห้อง:</h6>
                <h6 className="card-text mb-4">{room.DetailRoom}</h6>
                {/* Toggle button for booking details */}
                {room.bookings && room.bookings.length > 0 && (
                  <div>
                    <button 
                      className="btn btn-secondary mb-3"
                      onClick={() => toggleBookingDetails(room.RoomID)}
                    >
                      {expandedRoomIDs.has(room.RoomID) ? 'วันเวลาที่มีคนกำลังจอง:' : 'วันเวลาที่มีคนกำลังจอง:'}
                    </button>
                    
                    {expandedRoomIDs.has(room.RoomID) && (
                      <div>
                        
                        <ul className="list-unstyled">
                          {room.bookings.map((booking, index) => (
                            <li key={index} className="mb-2">
                              <span className="d-block">
                                <strong>วันที่:</strong> {new Date(booking.Start).toLocaleDateString()}
                              </span>
                              <span className="d-block">
                                <strong>เวลาเริ่ม:</strong> {new Date(booking.Start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                              </span>
                              <span className="d-block">
                                <strong>จนถึง:</strong> {new Date(booking.End).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <button 
                  className="btn btn-primary mt-3"
                  onClick={() => handleRoomSelect(room.RoomID)}
                >
                  เลือกห้อง
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default RoomDetailsPage;