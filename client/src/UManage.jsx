import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Navbar from './components/nevbar';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [idstatus, setIdstatus] = useState('user');
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      const storedStatus = localStorage.getItem('IDstatus');

      if (storedStatus !== 'admin') {
        alert('Access denied: Admins only');
        navigate('/');
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get('/api/users', { headers: { Authorization: `Bearer ${token}` } });
        const sortedUsers = response.data.sort((a, b) => a.IDstatus.localeCompare(b.IDstatus));
        setUsers(sortedUsers);
      } catch (error) {
        setError('Error fetching users');
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleAddUser = async () => {
    setError('');
    if (!username || !password || !idstatus) {
      setError('Please fill out all fields');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/api/users', { Username: username, Password: password, IDstatus: idstatus }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setUsername('');
      setPassword('');
      setIdstatus('user');
      const response = await axios.get('/api/users', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setUsers(response.data);
      handleShowModal('User added successfully');
    } catch (error) {
      setError('Error adding user');
      console.error('Error adding user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    setError('');
    if (!username || !idstatus) {
      setError('Please fill out all fields');
      return;
    }

    try {
      setLoading(true);
      await axios.put(`/api/users/${editUser.UserID}`, { Username: username, Password: password, IDstatus: idstatus }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setEditUser(null);
      setUsername('');
      setPassword('');
      setIdstatus('user');
      const response = await axios.get('/api/users', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setUsers(response.data);
      handleShowModal('User updated successfully');
    } catch (error) {
      setError('Error updating user');
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setUsername(user.Username);
    setIdstatus(user.IDstatus);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        await axios.delete(`/api/users/${userId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        const response = await axios.get('/api/users', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        setUsers(response.data);
        handleShowModal('User deleted successfully');
      } catch (error) {
        setError('Error deleting user');
        console.error('Error deleting user:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (message) => {
    setModalContent(message);
    setShowModal(true);
  };

  return (
    <div className='container'>
      <Navbar />
      <div className="container card p-5 my-5 bg-dark text-white rounded">
        <h1 className="my-4">User Management</h1>
        {loading && <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="row">
          <div className="col-md-4">
            <div className="mb-4">
              <h2>{editUser ? 'Edit User' : 'Add User'}</h2>
              <form>
                <div className="mb-3">
                  <label htmlFor="formUsername" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="formUsername"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="formPassword" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="formPassword"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="formIDstatus" className="form-label">ID Status</label>
                  <select
                    id="formIDstatus"
                    className="form-select"
                    value={idstatus}
                    onChange={(e) => setIdstatus(e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={editUser ? handleUpdateUser : handleAddUser}
                >
                  {editUser ? 'Update User' : 'Add User'}
                </button>
              </form>
            </div>
          </div>
          <div className="col-md-8">
            <h2 className="mb-4">Users List</h2>
            <table className="table table-bordered">
              <thead className='table-primary'>
                <tr>
                  <th>Username</th>
                  <th>ID Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className='table-info'>
                {users.map(user => (
                  <tr key={user.UserID}>
                    <td>{user.Username}</td>
                    <td>{user.IDstatus}</td>
                    <td>
                      <button
                        className="btn btn-warning"
                        onClick={() => handleEditUser(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger ms-2"
                        onClick={() => handleDeleteUser(user.UserID)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {showModal && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content bg-success">
                <div className="modal-header">
                  <h5 className="modal-title">Notification</h5>
                  <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                </div>
                <div className="modal-body">
                  {modalContent}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
