import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/nevbar';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminManagementPage = () => {
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ username: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Retrieve token and user IDstatus from localStorage
  const token = localStorage.getItem('token');
  const IDstatus = localStorage.getItem('IDstatus');

  // Check if the user is admin
  useEffect(() => {
    if (IDstatus !== 'admin') {
      alert('Access denied. Admins only.');
      navigate('/'); // Redirect to home or login page if not admin
    }
  }, [IDstatus, navigate]);

  // Set axios default headers with the token if it exists
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Function to fetch admin data
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admins');
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error.response || error);
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new admin
  const handleAddAdmin = async () => {
    if (!newAdmin.username.trim()) {
      toast.error('Username cannot be empty!');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/api/admins', newAdmin);
      setNewAdmin({ username: '' });
      fetchAdmins(); // Reload admins after adding
      toast.success('Admin added successfully!');
    } catch (error) {
      console.error('Error adding admin:', error);
      toast.error('Error adding admin. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to delete an admin
  const handleDeleteAdmin = async (username) => {
    if (window.confirm(`Are you sure you want to delete admin "${username}"?`)) {
      setLoading(true);
      try {
        await axios.delete(`/api/admins/${username}`);
        fetchAdmins(); // Reload admins after deletion
        toast.success('Admin deleted successfully!');
      } catch (error) {
        console.error('Error deleting admin:', error);
        toast.error('Error deleting admin. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Load admin data when component mounts
  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="container mt-5">
      <Navbar />
      <ToastContainer />
      <div className="card bg-dark text-white rounded">
        <h2 className="card-title mb-4 text-center">จัดการแอดมิน</h2>
        <div className="card-body">
          <div className="row">
            {/* Add Admin Section */}
            <div className="col-md-6">
              <div className="card bg-secondary  rounded ">
                <div className="card-body">
                  <h4 className="card-title">เพิ่มแอดมิน</h4>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter admin username"
                      value={newAdmin.username}
                      onChange={(e) => setNewAdmin({ username: e.target.value })}
                    />
                  </div>
                  <button 
                    className={`btn btn-primary mt-2 ${loading ? 'disabled' : ''}`} 
                    onClick={handleAddAdmin}
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'เพิ่มแอดมิน'}
                  </button>
                </div>
              </div>
            </div>

            {/* Admin List Section */}
            <div className="col-md-6">
              <div className="card bg-secondary rounded">
                <div className="card-body">
                  <h4 className="card-title">แอดมินลิส</h4>
                  {loading ? (
                    <div className="text-center">
                      <div className="spinner-border text-light" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <ul className="list-group">
                      {admins.map((admin, index) => (
                        <li
                          key={index}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          {admin.Username}
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteAdmin(admin.Username)}
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagementPage;
