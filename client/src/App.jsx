import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './App.css';
import Navbar from './components/nevbar';

const localizer = momentLocalizer(moment);

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('/api/bookings')
      .then(response => {
        console.log('API Response:', response.data);

        const formattedEvents = response.data
          .filter(booking => booking.Status === 'booking') // Filter only bookings with 'booking' status
          .map(booking => {
            const start = new Date(booking.Start); // Directly using DATETIME
            const end = new Date(booking.End); // Directly using DATETIME

          console.log('Parsed Dates:', start, end);

          // Ensure the date objects are valid
          if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            console.error('Invalid Date:', booking.Start, booking.End);
          }

          return {
            title: `${booking.RoomName} - ${booking.Name} - ${booking.Phone} - ${booking.Reason}`,
            start,
            end,
            RoomCenter: booking.RoomCenter,
          };
        });

        setEvents(formattedEvents);
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
      });
  }, []);

  const eventStyleGetter = (event) => {
    let backgroundColor = '';
    switch (event.RoomCenter) {
      case 'ศูนย์เทเวศร์':
        backgroundColor = '#3498db'; // Light Blue
        break;
      case 'ศูนย์พณิชยการพระนคร':
        backgroundColor = '#2ecc71'; // Green
        break;
      case 'ศูนย์พระนครเหนือ':
        backgroundColor = '#e74c3c'; // Red
        break;
      case 'ศูนย์โชติเวช':
        backgroundColor = '#f1c40f'; // Yellow
        break;
      default:
        backgroundColor = '#95a5a6'; // Grey for undefined
    }
  

    return {
      style: {
        backgroundColor,
        borderRadius: '0px',
        color: 'black',
        border: '0px',
        fontWeight: '550'
      }
    };
  };

  return (
    
    <div className="App">
      <Navbar />
      <div style={{marginTop: '20px'}}>
      <h1>Booking Calendar</h1>
      <div className="d-flex justify-content-end">
      <span className='badge' style={{background:'#3498db'}}>ศูนย์เทเวศร์</span>
      <span className='badge' style={{background:'#2ecc71'}}>ศูนย์พณิชยการพระนคร</span>
      <span className='badge' style={{background:'#e74c3c'}}>ศูนย์พระนครเหนือ</span>
      <span className='badge' style={{background:'#f1c40f'}}>ศูนย์โชติเวช</span>
      </div>
      <br />
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
      />
      </div>
    </div>
  );
}

export default App;
