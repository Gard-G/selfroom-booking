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
      <div style={{ width: '65vw' }}>
        <h1 className="mb-4">ห้องของ {selectedCenter}</h1>
        <div className="row">
          {rooms.map(room => (
            <div className="col-md-6 mb-4" key={room.RoomID}>
              <div className="card">

                <div className="card-body">
                  <h3 className="card-title">{room.RoomName}</h3>
                  {/* Show room image */}
                  {room.Image && (
                    <img
                      src={`https://selfroom.rmutp.ac.th/imagesrooms/${room.Image}`} // Correctly use the image URL
                      alt={room.RoomName}
                      className="img-fluid mb-3"
                      style={{ width: '230px', height: '160px', objectFit: 'cover' }}
                    />
                  )}
                  <h5 className="card-text">รายละเอียดห้อง:</h5>
                  <h5 className="card-text mb-4">{room.DetailRoom}</h5>

                  {/* Toggle button for booking details */}
                  {room.bookings && room.bookings.length > 0 ? (
  <div>
    <button
      className="btn btn-secondary mb-3"
      onClick={() => toggleBookingDetails(room.RoomID)}
    >
      {expandedRoomIDs.has(room.RoomID) ? 'ซ่อนวันเวลาที่มีการจอง' : 'ดูวันเวลาที่มีการจอง'}
    </button>

    {expandedRoomIDs.has(room.RoomID) && (
      <div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>วันที่เริ่ม</th>
              <th>วันที่สิ้นสุด</th>
              <th>เวลาเริ่ม</th>
              <th>ถึงเวลา</th>
            </tr>
          </thead>
          <tbody>
          {room.bookings
              .slice() // Clone the array to avoid mutating the original data
              .sort((a, b) => new Date(a.StartDate) - new Date(b.StartDate)) // Sort by StartDate
              .map((booking, index) => (
              <tr key={index}>
                <td>
                  {new Date(booking.StartDate).toLocaleDateString('th-TH', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td>
                  {new Date(booking.EndDate).toLocaleDateString('th-TH', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td>
                  {new Date(`1970-01-01T${booking.Start}`).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    hour12: false 
                  }).replace(':', '.')}
                </td>
                <td>
                  {new Date(`1970-01-01T${booking.End}`).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    hour12: false 
                  }).replace(':', '.')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
) : (
  <h6>ยังไม่มีการจองสำหรับห้องนี้</h6>
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
