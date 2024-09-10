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

  const handleDelete = (orderId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You need to log in first');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this order?');

    if (confirmDelete) {
      axios.delete(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => {
          // Remove the deleted order from the state
          setOrders(orders.filter(order => order.OrderBooking !== orderId));
          alert('Order deleted successfully');
        })
        .catch(error => {
          console.error('Error deleting order:', error);
          alert('Failed to delete order. Please try again later.');
        });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h1>รายการจองของคุณ</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr style={{fontSize: '20px'}}>
                <th>ชื่อห้อง</th>
                <th>ชื่อ-นามสกุล</th>
                <th>วันที่</th>
                <th>เวลาเริ่ม</th>
                <th>ถึงเวลา</th>
                <th>สถานะ</th>
                <th>Action</th> {/* New column for actions */}
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
                    <td>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDelete(order.OrderBooking)}
                      >
                        ลบ
                      </button>
                    </td>
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
