require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const ldap = require('ldapjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'your_jwt_secret'; // Ensure consistency


app.use(cors());
app.use(express.json());
app.use('/images', express.static('public/images'));
app.use('/imagesrooms', express.static(path.join(__dirname, 'public/imagesrooms')));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 20, // จำนวนการเชื่อมต่อสูงสุดใน pool
  queueLimit: 0
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
    pool.query(query, [username], (error, results) => {
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
    SELECT ob.OrderBooking, ob.Name, ob.StartDate, ob.EndDate, ob.Start, ob.End, ob.Status, lr.RoomName
    FROM orderbooking ob
    JOIN userlistorder ulo ON ob.OrderBooking = ulo.OrderBooking
    JOIN listroom lr ON ob.RoomID = lr.RoomID
    WHERE ulo.UserID = ?
  `;

  pool.query(query, [userID], (error, results) => {
    if (error) {
      return res.status(500).send('Error fetching data from database');
    }

    // ส่งผลลัพธ์โดยไม่ทำการแปลงวันที่ที่นี่
    res.json(results);
  });
});


// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
  res.send('This is a protected route');
});

// Route to fetch bookings 
app.get('/api/bookings', (req, res) => {
  const query = `
    SELECT 
      ob.OrderBooking, 
      ob.Name, 
      ob.StartDate, 
      ob.EndDate, 
      ob.Start, 
      ob.End, 
      ob.Phone, 
      ob.Reason, 
      ob.Status, 
      lr.RoomName, 
      lr.RoomCenter
    FROM orderbooking ob
    JOIN listroom lr ON ob.RoomID = lr.RoomID
  `;

  pool.query(query, (error, results) => {
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
    SELECT ob.OrderBooking, ob.Name, ob.StartDate, ob.EndDate, ob.Start, ob.End, ob.Phone, ob.Reason, ob.Status, lr.RoomName
    FROM orderbooking ob
    JOIN listroom lr ON ob.RoomID = lr.RoomID
    WHERE ob.Status = 'wait'
  `;
  pool.query(query, (error, results) => {
    if (error) {
      res.status(500).send('Error fetching data from database');
      return;
    }

    res.json(results);
  });
});



// Route to update booking status
app.put('/api/update-booking-status', (req, res) => {
  const { OrderBooking, newStatus } = req.body;

  const query = 'UPDATE orderbooking SET Status = ? WHERE OrderBooking = ?';
  pool.query(query, [newStatus, OrderBooking], (error, results) => {
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

  pool.query(deleteReferencesQuery, [id], (error) => {
    if (error) {
      console.error('Error deleting references:', error);
      return res.status(500).json({ message: 'Failed to delete references. Please try again later.' });
    }

    // Now delete the order
    const deleteOrderQuery = 'DELETE FROM orderbooking WHERE OrderBooking = ?';

    pool.query(deleteOrderQuery, [id], (error, results) => {
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
  pool.query('SELECT * FROM listroom WHERE RoomCenter = ?', [selectedCenter], (error, results) => {
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


// Fetch rooms with their bookings
app.get('/api/rooms-with-bookings', (req, res) => {
  const selectedCenter = req.query.center;
  const currentDate = new Date().toISOString().slice(0, 10);  // Get current date in 'YYYY-MM-DD' format
  const currentTime = new Date().toISOString().slice(11, 19); // Get current time in 'HH:MM:SS' format

  // Query to fetch rooms with their bookings
  const query = `
  SELECT lr.RoomID, lr.RoomName, lr.DetailRoom, lr.Image, ob.OrderBooking, ob.StartDate, ob.EndDate, ob.Start, ob.End, ob.Status
  FROM listroom lr
  LEFT JOIN orderbooking ob ON lr.RoomID = ob.RoomID 
  AND (ob.EndDate > ? OR (ob.EndDate = ? AND CONCAT(ob.EndDate, ' ', ob.End) >= ?))
  AND ob.Status != 'reject'
  WHERE lr.RoomCenter = ?
  ORDER BY lr.RoomID, ob.Start
  `;

  pool.query(query, [currentDate, currentDate, currentTime, selectedCenter], (error, results) => {
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
          Image: row.Image,  // Add image field here
        };
        rooms.push(roomMap[row.RoomID]);
      }
      if (row.OrderBooking) {
        roomMap[row.RoomID].bookings.push({
          OrderBooking: row.OrderBooking,
          StartDate: row.StartDate,
          EndDate: row.EndDate,
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
  pool.query(query, [roomID], (error, results) => {
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
// Set up storage and file filter for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/imagesrooms/'); // Save uploaded images in 'public/imagesrooms' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  },
});

const upload = multer({ storage: storage });

app.post('/api/add-room', upload.single('Image'), (req, res) => {
  const { RoomName, RoomCenter, DetailRoom } = req.body;
  const image = req.file ? req.file.filename : null; // Get image filename

  // Insert room details and image filename into database
  const query = 'INSERT INTO listroom (RoomName, RoomCenter, DetailRoom, Image) VALUES (?, ?, ?, ?)';
  const values = [RoomName, RoomCenter, DetailRoom, image];

  pool.query(query, values, (err, results) => {
    if (err) {
      console.error('Error inserting room:', err);
      res.status(500).json({ error: 'Failed to add room.' });
    } else {
      // Fetch the newly added room from the database
      const newRoom = {
        RoomID: results.insertId, // Get the ID of the newly added room
        RoomName,
        RoomCenter,
        DetailRoom,
        Image: image
      };
      res.status(200).json(newRoom); // Return the new room data
    }
  });
});



// Get all rooms
app.get('/api/rooms-all', (req, res) => {
  const query = 'SELECT * FROM listroom';
  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// API endpoint for editing rooms
app.put('/api/edit-room/:id', upload.single('Image'), (req, res) => {
  const { RoomName, DetailRoom, RoomCenter } = req.body;
  const { id } = req.params;
  const image = req.file ? req.file.filename : null;

  let query = 'UPDATE listroom SET RoomName = ?, DetailRoom = ?, RoomCenter = ?';
  const values = [RoomName, DetailRoom, RoomCenter];

  // If an image was uploaded, include it in the update
  if (image) {
    query += ', Image = ?';
    values.push(image);
  }

  query += ' WHERE RoomID = ?';
  values.push(id);

  pool.query(query, values, (error, results) => {
    if (error) {
      console.error('Error updating room:', error);
      return res.status(500).send('Error updating room');
    }

    if (results.affectedRows === 0) {
      return res.status(404).send('Room not found');
    }

    res.status(200).send('Room updated successfully');
  });
});



// API endpoint for deleting a room
app.delete('/api/delete-room/:id', (req, res) => {
  const { id } = req.params;

  const deleteRoomQuery = 'DELETE FROM listroom WHERE RoomID = ?';
  pool.query(deleteRoomQuery, [id], (error, results) => {
    if (error) {
      console.error('Error deleting room:', error);
      return res.status(500).json({ message: 'Failed to delete room. Please try again later.' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json({ message: 'Room deleted successfully' });
  });
});




// Route to create a new booking
app.post('/api/bookings', authenticateToken, (req, res) => {
  const { RoomID, StartDate, EndDate, StartTime, EndTime, Name, Phone, Reason } = req.body;
  const userID = req.user.username;

  if (!RoomID || !StartDate || !EndDate || !StartTime || !EndTime || !Name || !Phone || !Reason) {
    return res.status(400).send('Missing required fields');
  }

// ตรวจสอบการจองที่ทับซ้อนกัน
const checkOverlapQuery = `
  SELECT * FROM orderbooking
  WHERE RoomID = ? AND Status != 'reject' AND (
    (StartDate BETWEEN ? AND ? AND Start BETWEEN ? AND ?) OR
    (EndDate = ? AND Start BETWEEN ? AND ?)   -- วันที่สิ้นสุดของจองแรกตรงกับวันที่เริ่มต้นของจองใหม่

  )
`;

pool.query(checkOverlapQuery, [
  RoomID,
  StartDate, EndDate,StartTime , EndTime,  
  StartDate, StartTime , EndTime // วันที่สิ้นสุดของจองแรกตรงกับวันที่เริ่มต้นของจองใหม่

  ], (error, results) => {
    if (error) {
      console.error('Error checking for overlapping bookings:', error);
      return res.status(500).json({ error: 'Error checking for overlapping bookings', details: error });
    }

    if (results.length > 0) {
      return res.status(400).send('ไม่สามารถจองในช่วงเวลานี้ในวันที่นี้ได้เนื่องจากมีการจองซ้ำ');
    }

    // Insert booking into orderbooking table
    const insertBookingQuery = 'INSERT INTO orderbooking (RoomID, StartDate, EndDate, Start, End, Status, Name, Phone, Reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const status = 'wait';

    pool.query(insertBookingQuery, [RoomID, StartDate, EndDate, StartTime, EndTime, status, Name, Phone, Reason], (error, results) => {
      if (error) {
        console.error('Error inserting booking:', error);
        return res.status(500).json({ error: 'Error creating booking', details: error });
      }

      const orderBookingID = results.insertId;

      // Link user to booking
      const userListOrderQuery = 'INSERT INTO userlistorder (UserID, OrderBooking) VALUES (?, ?)';
      pool.query(userListOrderQuery, [userID, orderBookingID], (error) => {
        if (error) {
          console.error('Error linking user to booking:', error);
          return res.status(500).json({ error: 'Error linking user to booking', details: error });
        }

        return res.status(201).send('การจองสำเร็จ');
      });
    });
  });
});


// Route to create a new booking แบบ วันทั้งเดือน
app.post('/api/bookings/weekly', authenticateToken, (req, res) => {
  const { RoomID, DayOfWeek, StartTime, EndTime, Name, Phone, Reason, StartMonth, EndMonth } = req.body;
  const userID = req.user.username;

  if (!RoomID || !DayOfWeek || !StartTime || !EndTime || !Name || !Phone || !Reason || !StartMonth || !EndMonth) {
    return res.status(400).send('Missing required fields');
  }

  // กำหนดโซนเวลาไทย
  const toThaiTime = (date) => {
    const offset = 7 * 60 * 60 * 1000; // UTC+7
    return new Date(date.getTime() + offset);
  };

  // วันนี้ (ปัจจุบัน)
  const today = new Date();

  // เปลี่ยน StartMonth และ EndMonth เป็นวันที่ (ถ้าเลือกเดือนอื่น)
  const startMonth = new Date(StartMonth); // StartMonth คือ string ที่ส่งมาเป็น 'YYYY-MM'
  const endMonth = new Date(EndMonth); // EndMonth คือ string ที่ส่งมาเป็น 'YYYY-MM'

  // ตรวจสอบว่า StartMonth และ EndMonth เป็นวันที่ที่ถูกต้อง
  if (isNaN(startMonth) || isNaN(endMonth)) {
    return res.status(400).send('Invalid month format');
  }

  // กำหนดช่วงวันที่เริ่มต้นและสิ้นสุด
  const startDate = toThaiTime(new Date(startMonth.getFullYear(), startMonth.getMonth(), 1)); // วันที่เริ่มต้นของเดือน
  const endDate = toThaiTime(new Date(endMonth.getFullYear(), endMonth.getMonth() + 1, 0)); // วันที่สิ้นสุดของเดือน

  const dayMap = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
  const selectedDay = dayMap[DayOfWeek];
  const bookings = [];

  // สร้างรายการจองสำหรับวันในเดือนที่เลือก
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const currentDate = new Date(d);

    // ตรวจสอบว่าเป็นวันที่ผ่านมาแล้วหรือไม่
    if (currentDate < today) {
      continue;  // ถ้าเป็นวันที่ผ่านมาแล้ว ให้ข้าม
    }

    if (currentDate.getDay() === selectedDay) {
      bookings.push([
        RoomID,
        currentDate.toISOString().split('T')[0], // StartDate
        currentDate.toISOString().split('T')[0], // EndDate
        StartTime,
        EndTime,
        'wait',
        Name,
        Phone,
        Reason,
      ]);
    }
  }

  if (bookings.length === 0) {
    return res.status(400).send(`ไม่มีวัน ${DayOfWeek} ให้จองในเดือนที่เลือก`);
  }

  // ตรวจสอบการจองที่ซ้อนทับ
  const checkOverlapQuery = `
  SELECT * FROM orderbooking
  WHERE RoomID = ? 
    AND (
    (StartDate BETWEEN ? AND ? AND Start BETWEEN ? AND ?) OR
    (EndDate = ? AND Start BETWEEN ? AND ?)   -- วันที่สิ้นสุดของจองแรกตรงกับวันที่เริ่มต้นของจองใหม่

  )
`;

  const overlapPromises = bookings.map(([roomId, startDate, endDate , startTime, endTime]) => {
    return new Promise((resolve, reject) => {
      pool.query(checkOverlapQuery, [
        roomId,
        startDate, endDate, startTime , endTime,  
        startDate, startTime , endTime // วันที่สิ้นสุดของจองแรกตรงกับวันที่เริ่มต้นของจองใหม่
      ], (error, results) => {
        if (error) return reject(error);
        return resolve(results.length > 0); // ถ้าซ้ำซ้อน return true
      });
    });
  });

  Promise.all(overlapPromises)
    .then((overlaps) => {
      if (overlaps.includes(true)) {
        return res.status(400).send('ไม่สามารถจองในบางวันได้เนื่องจากมีการจองซ้ำ');
      }

      // ถ้าไม่มีการจองซ้อน ให้เพิ่มการจอง
      const insertBookingQuery = `
        INSERT INTO orderbooking (RoomID, StartDate, EndDate, Start, End, Status, Name, Phone, Reason)
        VALUES ?
      `;

      pool.query(insertBookingQuery, [bookings], (error, result) => {
        if (error) {
          console.error('Error creating weekly bookings:', error);
          return res.status(500).json({ error: 'Error creating weekly bookings', details: error });
        }

        const firstInsertedID = result.insertId; // ID ของรายการแรก
        const userListOrderEntries = bookings.map((_, index) => [
          userID,
          firstInsertedID + index, // ID ของแต่ละรายการ
        ]);

        const userListOrderQuery = `
          INSERT INTO userlistorder (UserID, OrderBooking) VALUES ?
        `;
        pool.query(userListOrderQuery, [userListOrderEntries], (error) => {
          if (error) {
            console.error('Error linking user to booking:', error);
            return res.status(500).json({ error: 'Error linking user to booking', details: error });
          }

          return res.status(201).send('การจองสำเร็จ');
        });
      });
    })
    .catch((error) => {
      console.error('Error checking overlapping bookings:', error);
      return res.status(500).json({ error: 'Error checking overlapping bookings', details: error });
    });
});










// ดึงรายชื่อ admin
app.get('/api/admins', authenticateToken, (req, res) => {
  const query = 'SELECT Username FROM adminlist';
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching admins:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// เพิ่ม admin
app.post('/api/admins', authenticateToken, (req, res) => {
  const { username } = req.body;
  const query = 'INSERT INTO adminlist (Username) VALUES (?)';
  pool.query(query, [username], (err, result) => {
    if (err) {
      console.error('Error adding admin:', err);
      return res.status(500).send(err);
    }
    res.status(200).send('Admin added successfully');
  });
});

// ลบ admin
app.delete('/api/admins/:username', authenticateToken, (req, res) => {
  const { username } = req.params;
  const query = 'DELETE FROM adminlist WHERE Username = ?';
  pool.query(query, [username], (err, result) => {
    if (err) {
      console.error('Error deleting admin:', err);
      return res.status(500).send(err);
    }
    res.status(200).send('Admin deleted successfully');
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
