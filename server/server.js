const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'secret'; // Replace with your actual secret key

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
app.post('/api/users', authenticateToken, (req, res) => {
  const { Username, Password, IDstatus } = req.body;

  if (!Username || !Password || !IDstatus) {
    return res.status(400).send('Missing required fields');
  }
    const query = 'INSERT INTO user (Username, Password, IDstatus) VALUES (?, ?, ?)';
    connection.query(query, [Username, Password, IDstatus], (error) => {
      if (error) {
        console.error('Error adding user:', error);
        return res.status(500).send('Server error');
      }
      res.status(201).send('User created successfully');
    });
});

// Edit an existing user
app.put('/api/users/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { Username, Password, IDstatus } = req.body;

  if (!Username || !IDstatus) {
    return res.status(400).send('Missing required fields');
  }

  const updateQuery = 'UPDATE user SET Username = ?, IDstatus = ? WHERE UserID = ?';
  const queryParams = [Username, IDstatus, id];

  if (Password) {
      const updateQueryWithPassword = 'UPDATE user SET Username = ?, Password = ?, IDstatus = ? WHERE UserID = ?';
      connection.query(updateQueryWithPassword, [Username, Password, IDstatus, id], (error) => {
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
});

// Test route
app.post('/api/test', (req, res) => {
  res.send('Test route works!');
});

// Route to login
app.post('/api/login', (req, res) => {
  const { Username, Password } = req.body;

  const query = 'SELECT * FROM user WHERE Username = ?';
  connection.query(query, [Username], (error, results) => {
    if (error) {
      return res.status(500).send('Error fetching data from database');
    }
    if (results.length === 0) {
      return res.status(401).send('Invalid credentials');
    }

    const user = results[0];

    // Direct comparison if passwords are not hashed
    if (Password !== user.Password) {
      return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ UserID: user.UserID, IDstatus: user.IDstatus }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, IDstatus: user.IDstatus  });
  });
});

// Route to fetch user info
app.get('/api/user-info', authenticateToken, (req, res) => {
  // `req.user` contains the user data after authentication
  res.json(req.user);
});

// Route to Fetch Orders by User
app.get('/api/user-orders', authenticateToken, (req, res) => {
  const userID = req.user.UserID;

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
      Date: new Date(booking.Date).toLocaleDateString(), // Formatting Date
      Start: new Date(booking.Start).toLocaleTimeString(), // Formatting Start Time
      End: new Date(booking.End).toLocaleTimeString() // Formatting End Time
    }));
    
    // Send the formatted results as the response
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

// Route to fetch rooms
app.get('/api/rooms', (req, res) => {
  const query = 'SELECT * FROM listroom';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).send('Error fetching rooms from database');
      return;
    }
    res.json(results);
  });
});

// Route to fetch room centers (replace this if your centers are static)
app.get('/api/room-centers', (req, res) => {
  const roomCenters = ['ศูนย์เทเวศร์', 'ศูนย์พณิชยการพระนคร', 'ศูนย์พระนครเหนือ', 'ศูนย์โชติเวช'];
  res.json(roomCenters);
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
  const userID = req.user.UserID; // Get the UserID from the authenticated token
  
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

    const orderBookingID = results.insertId; // Get the ID of the newly created booking

    // Insert into userlistorder
    const userListOrderQuery = 'INSERT INTO userlistorder (UserID, OrderBooking) VALUES (?, ?)';
    connection.query(userListOrderQuery, [userID, orderBookingID], (error, results) => {
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
