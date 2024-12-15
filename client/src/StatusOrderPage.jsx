import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/nevbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const StatusOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // เปลี่ยน place-items ของ body เมื่อเข้าไปในหน้า StatusOrderPage
    document.body.style.placeItems = 'start'; // place-items: start; แทน top

    // คืนค่าการตั้งค่าเดิมเมื่อออกจากหน้า
    return () => {
      document.body.style.placeItems = ''; // คืนค่ากลับเป็นค่าเดิม
    };
  }, []);

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
      <div className="container mt-5">
        <h1 >รายการจองของคุณ</h1>
        <h5>*จะอนุมัติหรือปฏิเสธการจองภายใน 1 วันทำการ</h5>
        {error && <div className="alert alert-danger">{error}</div>}
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table className="table table-striped table-bordered mt-4">
            <thead className="table-dark">
              <tr style={{ fontSize: '20px' }}>
                <th>ชื่อห้อง</th>
                <th>ชื่อ-นามสกุล</th>
                <th>วันที่เริ่มจอง</th> {/* เปลี่ยนเป็น StartDate */}
                <th>วันที่สิ้นสุด</th> {/* เพิ่ม EndDate */}
                <th>เวลาเริ่ม</th>
                <th>ถึงเวลา</th>
                <th>วัตถุประสงค์/เหตุผลที่ปฏิเสธ</th>
                <th>สถานะ</th>
                <th></th> {/* New column for actions */}
              </tr>
            </thead>
            <tbody className='table-info'>
              {orders.map(order => (
                <tr key={order.OrderBooking}>
                  <td>{order.RoomName}</td>
                  <td>{order.Name}</td>
                  <td>{new Date(order.StartDate).toLocaleDateString('th-TH', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}</td> {/* แสดง StartDate */}
                  <td>{new Date(order.EndDate).toLocaleDateString('th-TH', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}</td> {/* แสดง EndDate */}
                  <td>{new Date(`1970-01-01T${order.Start}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</td> {/* แสดง Start */}
                  <td>{new Date(`1970-01-01T${order.End}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</td> {/* แสดง End */}
                  <td>{order.Reason}</td>
                  <td>{order.Status}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(order.OrderBooking)}
                    >
                      ยกเลิกการจอง
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
};

export default StatusOrderPage;
