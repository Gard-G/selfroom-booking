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

        const formattedEvents = response.data.map(booking => {
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
            status: booking.Status
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
    if (event.status === 'booking') {
      backgroundColor = 'green';
    } else if (event.status === 'reject') {
      backgroundColor = 'red';
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
