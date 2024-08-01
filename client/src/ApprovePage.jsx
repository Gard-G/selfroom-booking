import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApprovePage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/wait-bookings')
      .then(response => {
        setBookings(response.data);
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
      });
  }, []);

  const handleUpdateStatus = (OrderBooking, newStatus) => {
    axios.put('http://localhost:5000/api/update-booking-status', { OrderBooking, newStatus })
      .then(response => {
        setBookings(bookings.filter(booking => booking.OrderBooking !== OrderBooking));
      })
      .catch(error => {
        console.error('Error updating booking status:', error);
      });
  };

  return (
    <div>
      <h1>Approve Bookings</h1>
      <table border={5}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Start</th>
            <th>End</th>
            <th>Phone</th>
            <th>Reason</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <tr key={booking.OrderBooking}>
              <td>{booking.Name}</td>
              <td>{booking.Date}</td>
              <td>{booking.Start}</td>
              <td>{booking.End}</td>
              <td>{booking.Phone}</td>
              <td>{booking.Reason}</td>
              <td>
                <button onClick={() => handleUpdateStatus(booking.OrderBooking, 'booking')}>Approve</button>
                <button onClick={() => handleUpdateStatus(booking.OrderBooking, 'reject')}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApprovePage;
