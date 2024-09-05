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


// Test route
app.post('/api/test', (req, res) => {
  res.send('Test route works!');
});

// Route to fetch user info
app.get('/api/user-info', authenticateToken, (req, res) => {
  // `req.user` contains the user data after authentication
  res.json(req.user);
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

app.get('/api/rooms-with-bookings', (req, res) => {
  const selectedCenter = req.query.center;
  const currentDate = new Date().toISOString().slice(0, 10);  // Get current date in 'YYYY-MM-DD' format
  const currentTime = new Date().toISOString().slice(11, 19); // Get current time in 'HH:MM:SS' format

  // Query to fetch rooms with their bookings
  const query = `
    SELECT lr.RoomID, lr.RoomName, lr.DetailRoom, ob.OrderBooking, ob.Date, ob.Start, ob.End, ob.Status
    FROM listroom lr
    LEFT JOIN orderbooking ob ON lr.RoomID = ob.RoomID 
    AND (ob.Date > ? OR (ob.Date = ? AND ob.End >= ?))
    WHERE lr.RoomCenter = ?
    ORDER BY lr.RoomID, ob.Start
  `;

  connection.query(query, [currentDate, currentDate, currentTime, selectedCenter], (error, results) => {
    if (error) {
      console.error('Error fetching rooms with bookings:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Group bookings by room
    const rooms = [];
    const roomMap = {};

    results.forEach(row => {
      if (!roomMap[row.RoomID]) {
        roomMap[row.RoomID] = {
          RoomID: row.RoomID,
          RoomName: row.RoomName,
          DetailRoom: row.DetailRoom,
          bookings: [],
        };
        rooms.push(roomMap[row.RoomID]);
      }
      if (row.OrderBooking) {
        roomMap[row.RoomID].bookings.push({
          OrderBooking: row.OrderBooking,
          Date: row.Date,
          Start: row.Start,
          End: row.End,
          Status: row.Status,
        });
      }
    });

    res.json(rooms);
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
