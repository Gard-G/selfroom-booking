const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 5000;

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

// Test route
app.post('/api/test', (req, res) => {
  res.send('Test route works!');
});

// Route to fetch bookings
app.get('/api/bookings', (req, res) => {
  const query = `
    SELECT ob.OrderBooking, ob.Name, ob.Date, ob.Start, ob.End, ob.Phone, ob.Reason, ob.Status, lr.RoomName
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
    res.json(formattedResults);  // This is the fixed point
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

// Route to create a new booking
app.post('/api/bookings', (req, res) => {
  const { RoomID, Date, Start, End, Name, Phone, Reason } = req.body;
  
  // Validate the input data
  if (!RoomID || !Date || !Start || !End || !Name || !Phone || !Reason) {
    return res.status(400).send('Missing required fields');
  }

  // Construct the SQL query
  const query = 'INSERT INTO orderbooking (RoomID, Date, Start, End, Status, Name, Phone, Reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const status = 'wait'; // Fixed status

  // Execute the query
  connection.query(query, [RoomID, Date, Start, End, status, Name, Phone, Reason], (error, results) => {
    if (error) {
      console.error('Error inserting booking:', error);
      return res.status(500).json({ error: 'Error creating booking', details: error });
    }
    res.status(201).send('Booking created successfully');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
