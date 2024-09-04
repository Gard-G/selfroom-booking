const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const ldap = require('ldapjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');


const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'your_jwt_secret'; // Ensure consistency


app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'booking_selfroomdb'
});

connection.connect(error => {
  if (error) {
    console.error('Error connecting to MySQL:', error);
    return;
  }
  console.log('Connected to MySQL');
});

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, SECRET_KEY, (error, user) => {
    if (error) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user;
    next();
  });
};

// User Management Endpoints

// Get all users
app.get('/api/users', authenticateToken, (req, res) => {
  const query = 'SELECT UserID, Username, IDstatus FROM user';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching users:', error);
      return res.status(500).send('Server error');
    }
    res.json(results);
  });
});

// Add a new user
app.post('/api/users', authenticateToken, async (req, res) => {
  const { Username, Password, IDstatus } = req.body;

  if (!Username || !Password || !IDstatus) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const hashedPassword = await bcrypt.hash(Password, 10);
    const query = 'INSERT INTO user (Username, Password, IDstatus) VALUES (?, ?, ?)';
    connection.query(query, [Username, hashedPassword, IDstatus], (error) => {
      if (error) {
        console.error('Error adding user:', error);
        return res.status(500).send('Server error');
      }
      res.status(201).send('User created successfully');
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).send('Server error');
  }
});

// Edit an existing user
app.put('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { Username, Password, IDstatus } = req.body;

  if (!Username || !IDstatus) {
    return res.status(400).send('Missing required fields');
  }

  const updateQuery = 'UPDATE user SET Username = ?, IDstatus = ? WHERE UserID = ?';
  const queryParams = [Username, IDstatus, id];

  try {
    if (Password) {
      const hashedPassword = await bcrypt.hash(Password, 10);
      const updateQueryWithPassword = 'UPDATE user SET Username = ?, Password = ?, IDstatus = ? WHERE UserID = ?';
      connection.query(updateQueryWithPassword, [Username, hashedPassword, IDstatus, id], (error) => {
        if (error) {
          console.error('Error updating user:', error);
          return res.status(500).send('Server error');
        }
        res.send('User updated successfully');
      });
    } else {
      connection.query(updateQuery, queryParams, (error) => {
        if (error) {
          console.error('Error updating user:', error);
          return res.status(500).send('Server error');
        }
        res.send('User updated successfully');
      });
    }
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).send('Server error');
  }
});

// Delete an existing user
app.delete('/api/users/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  const deleteQuery = 'DELETE FROM user WHERE UserID = ?';

  connection.query(deleteQuery, [id], (error, results) => {
    if (error) {
      console.error('Error deleting user:', error);
      return res.status(500).send('Server error');
    }

    if (results.affectedRows === 0) {
      return res.status(404).send('User not found');
    }

    res.send('User deleted successfully');
  });
});

// Test route
app.post('/api/test', (req, res) => {
  res.send('Test route works!');
});

// Route to login with Active Directory
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const client = ldap.createClient({
    url: 'ldap://203.158.239.97'  // เปลี่ยนเป็น LDAPS ถ้าจำเป็น
  });

  const dn = `${username}@rmutp.ac.th`;  // ใช้ UPN

  client.bind(dn, password, (err) => {
    if (err) {
      console.error('LDAP bind failed:', err.message);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const query = 'SELECT * FROM adminlist WHERE Username = ?';
    connection.query(query, [username], (error, results) => {
      if (error) {
        console.error('Error querying adminlist:', error);
        return res.status(500).send('Error checking admin status');
      }

      const IDstatus = results.length > 0 ? 'admin' : 'user';
      const token = jwt.sign({ username, IDstatus }, SECRET_KEY, { expiresIn: '1h' });

      res.json({ token, IDstatus });
      client.unbind();
    });
  });
});







// Route to fetch user info
app.get('/api/user-info', authenticateToken, (req, res) => {
  // `req.user` contains the user data after authentication
  res.json(req.user);
});

// Route to Fetch Orders by User
app.get('/api/user-orders', authenticateToken, (req, res) => {
  const userID = req.user.username; // Adjust if needed

  const query = `
    SELECT ob.OrderBooking, ob.Name, ob.Date, ob.Start, ob.End, ob.Status, lr.RoomName
    FROM orderbooking ob
    JOIN userlistorder ulo ON ob.OrderBooking = ulo.OrderBooking
    JOIN listroom lr ON ob.RoomID = lr.RoomID
    WHERE ulo.UserID = ?
  `;
  
  connection.query(query, [userID], (error, results) => {
    if (error) {
      return res.status(500).send('Error fetching data from database');
    }

    const formattedResults = results.map(booking => ({
      ...booking,
      Date: new Date(booking.Date).toLocaleDateString(),
      Start: new Date(booking.Start).toLocaleTimeString(),
      End: new Date(booking.End).toLocaleTimeString()
    }));

    res.json(formattedResults);
  });
});

// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
  res.send('This is a protected route');
});

// Route to fetch bookings
app.get('/api/bookings', (req, res) => {
  const query = `
    SELECT ob.OrderBooking, ob.Name, ob.Date, ob.Start, ob.End, ob.Phone, ob.Reason, ob.Status, lr.RoomName, lr.RoomCenter
    FROM orderbooking ob
    JOIN listroom lr ON ob.RoomID = lr.RoomID
  `;
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).send('Error fetching data from database');
      return;
    }
    res.json(results);
  });
});

// Route to fetch bookings with "wait" status
app.get('/api/wait-bookings', (req, res) => {
  const query = `
    SELECT ob.OrderBooking, ob.Name, ob.Date, ob.Start, ob.End, ob.Phone, ob.Reason, ob.Status, lr.RoomName
    FROM orderbooking ob
    JOIN listroom lr ON ob.RoomID = lr.RoomID
    WHERE ob.Status = 'wait'
  `;
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).send('Error fetching data from database');
      return;
    }
    
    // Format the date fields BEFORE sending the response
    const formattedResults = results.map(booking => ({
      ...booking,
      Date: new Date(booking.Date).toLocaleDateString(),
      Start: new Date(booking.Start).toLocaleTimeString(),
      End: new Date(booking.End).toLocaleTimeString()
    }));
    
    res.json(formattedResults);
  });
});

// Route to update booking status
app.put('/api/update-booking-status', (req, res) => {
  const { OrderBooking, newStatus } = req.body;

  const query = 'UPDATE orderbooking SET Status = ? WHERE OrderBooking = ?';
  connection.query(query, [newStatus, OrderBooking], (error, results) => {
    if (error) {
      res.status(500).send('Error updating booking status');
      return;
    }
    res.status(200).send('Booking status updated successfully');
  });
});

// API endpoint to delete an order
app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params;

  // First delete any references in the userlistorder table
  const deleteReferencesQuery = 'DELETE FROM userlistorder WHERE OrderBooking = ?';
  
  connection.query(deleteReferencesQuery, [id], (error) => {
    if (error) {
      console.error('Error deleting references:', error);
      return res.status(500).json({ message: 'Failed to delete references. Please try again later.' });
    }

    // Now delete the order
    const deleteOrderQuery = 'DELETE FROM orderbooking WHERE OrderBooking = ?';
    
    connection.query(deleteOrderQuery, [id], (error, results) => {
      if (error) {
        console.error('Error deleting order:', error);
        return res.status(500).json({ message: 'Failed to delete order. Please try again later.' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.status(200).json({ message: 'Order deleted successfully' });
    });
  });
});

// Route to fetch rooms
app.get('/api/rooms', (req, res) => {
  const selectedCenter = req.query.center;
  // Query your database for rooms based on the selectedCenter
  connection.query('SELECT * FROM listroom WHERE RoomCenter = ?', [selectedCenter], (error, results) => {
    if (error) {
      console.error('Error fetching rooms:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
});


// Route to fetch room centers
app.get('/api/room-centers', (req, res) => {
  const roomCenters = ['ศูนย์เทเวศร์', 'ศูนย์พณิชยการพระนคร', 'ศูนย์พระนครเหนือ', 'ศูนย์โชติเวช'];
  res.json(roomCenters);
});

// Route to fetch rooms by center
app.get('/api/rooms-by-center', (req, res) => {
  const center = req.query.center;

  if (!center) {
    return res.status(400).send('Center is required');
  }

  const query = 'SELECT * FROM listroom WHERE RoomCenter = ?';
  connection.query(query, [center], (error, results) => {
    if (error) {
      console.error('Error fetching rooms by center:', error);
      return res.status(500).send('Error fetching rooms');
    }
    res.json(results);
  });
});


// Route to fetch room details by ID
app.get('/api/rooms/:id', (req, res) => {
  const roomID = req.params.id;

  if (!roomID) {
    return res.status(400).send('Room ID is required');
  }

  const query = 'SELECT * FROM listroom WHERE RoomID = ?';
  connection.query(query, [roomID], (error, results) => {
    if (error) {
      console.error('Error fetching room details:', error);
      return res.status(500).send('Error fetching room details');
    }
    if (results.length === 0) {
      return res.status(404).send('Room not found');
    }
    res.json(results[0]);
  });
});


// Route to add a new room
app.post('/api/add-room', authenticateToken, (req, res) => {
  const { RoomName, RoomCenter } = req.body;

  if (!RoomName || !RoomCenter) {
    return res.status(400).send('Missing required fields');
  }

  const query = 'INSERT INTO listroom (RoomName, RoomCenter) VALUES (?, ?)';
  connection.query(query, [RoomName, RoomCenter], (error) => {
    if (error) {
      res.status(500).send('Error adding room to database');
      return;
    }
    res.status(201).send('Room added successfully');
  });
});

// Route to create a new booking
app.post('/api/bookings', authenticateToken, (req, res) => {
  const { RoomID, Date, Start, End, Name, Phone, Reason } = req.body;
  const userID = req.user.username; // Ensure userID is correct

  if (!RoomID || !Date || !Start || !End || !Name || !Phone || !Reason) {
    return res.status(400).send('Missing required fields');
  }

  const query = 'INSERT INTO orderbooking (RoomID, Date, Start, End, Status, Name, Phone, Reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const status = 'wait';

  connection.query(query, [RoomID, Date, Start, End, status, Name, Phone, Reason], (error, results) => {
    if (error) {
      console.error('Error inserting booking:', error);
      return res.status(500).json({ error: 'Error creating booking', details: error });
    }

    const orderBookingID = results.insertId;

    const userListOrderQuery = 'INSERT INTO userlistorder (UserID, OrderBooking) VALUES (?, ?)';
    connection.query(userListOrderQuery, [userID, orderBookingID], (error) => {
      if (error) {
        console.error('Error inserting into userlistorder:', error);
        return res.status(500).json({ error: 'Error linking user to booking', details: error });
      }
      res.status(201).send('Booking created and linked to user successfully');
    });
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
