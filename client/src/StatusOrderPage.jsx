import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/nevbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const StatusOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again later.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Your Orders</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr style={{fontSize: '20px'}}>
                <th>Room Name</th>
                <th>Name</th>
                <th>Date</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className='table-info'>
              {orders.map(order => (
                <tr key={order.OrderBooking}>
                  <td>{order.RoomName}</td>
                  <td>{order.Name}</td>
                  <td>{order.Date}</td>
                  <td>{order.Start}</td>
                  <td>{order.End}</td>
                  <td>{order.Status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default StatusOrderPage;
