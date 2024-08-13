import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/nevbar';

function StatusOrderPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You need to log in first');
      window.location.href = '/login';
      return;
    }

    axios.get('/api/user-orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  }, []);

  return (
    
    <div>
      <Navbar />
      <div>
      <h1>Your Orders</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Room Name</th>
            <th>Date</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.OrderBooking}>
              <td>{order.OrderBooking}</td>
              <td>{order.RoomName}</td>
              <td>{order.Date}</td>
              <td>{order.Start}</td>
              <td>{order.End}</td>
              <td>{order.Status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default StatusOrderPage;