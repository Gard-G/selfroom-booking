import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './App.css';
import Navbar from './components/nevbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const localizer = momentLocalizer(moment); // Initialize moment localizer for calendar

// Custom toolbar component for the calendar
function CustomToolbar(props) {
  const goToView = (view) => {
    props.onView(view); // Switch calendar view (Month, Day, Agenda)
  };

  return (
    <div className=''>
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        {/* Custom Previous Button */}
        <button 
          type="button" 
          style={{ backgroundColor: '#007bff', color: '#fff' }} // Custom button styles
          onClick={() => props.onNavigate('PREV')} // Navigate to previous view (e.g., previous month)
        >
          {"<"}
        </button>
      </span>

      <span className="rbc-btn-group">
        {/* Custom Next Button */}
        <button type="button" style={{ backgroundColor: '#007bff', color: '#fff' }} onClick={() => props.onNavigate('NEXT')}>
          {">"}
        </button>
      </span>

      <span className="rbc-btn-group">
        {/* Custom Today Button */}
        <button type="button" style={{ backgroundColor: '#007bff', color: '#fff' }} onClick={() => props.onNavigate('TODAY')}>
          Today
        </button>
      </span>

      {/* Calendar Label (e.g., Month/Year) */}
      <span className="rbc-toolbar-label"><h3>{props.label}</h3></span>

      <span className="rbc-btn-group">
        {/* View Buttons */}
        <button type="button" style={{ backgroundColor: '#007bff', color: '#fff' }} onClick={() => goToView('month')}>Month</button>
        <button type="button" style={{ backgroundColor: '#007bff', color: '#fff' }} onClick={() => goToView('day')}>Day</button>
        <button type="button" style={{ backgroundColor: '#007bff', color: '#fff' }} onClick={() => goToView('agenda')}>Agenda</button>
      </span>
    </div>
    </div>
  );
}

function App() {
  const [events, setEvents] = useState([]); // State to store events from the API
  const [selectedCenter, setSelectedCenter] = useState(null); // State to track the selected center for filtering

  // Fetch events from the backend API on component mount
  useEffect(() => {
    axios.get('/api/bookings')
      .then(response => {
        // Format the events received from the API
        const formattedEvents = response.data
          .filter(booking => booking.Status === 'booking') // Filter only bookings with 'booking' status
          .map(booking => {
            const start = new Date(booking.Start); // Convert start date to JavaScript Date object
            const end = new Date(booking.End); // Convert end date to JavaScript Date object
            return {
              title: `${booking.RoomName} - ${booking.Name} - ${booking.Phone} - ${booking.Reason}`, // Event title
              start,
              end,
              RoomCenter: booking.RoomCenter, // Store the room center for filtering
              ...booking // Store the entire booking object for later use
            };
          });

        setEvents(formattedEvents); // Update the state with the formatted events
      })
      .catch(error => {
        console.error('Error fetching bookings:', error); // Handle any errors during the API call
      });
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // Function to customize the style of events based on their RoomCenter
  const eventStyleGetter = (event) => {
    let backgroundColor = ''; // Variable to store the background color based on RoomCenter
    switch (event.RoomCenter) {
      case 'ศูนย์เทเวศร์':
        backgroundColor = '#3498db'; // Light Blue for ศูนย์เทเวศร์
        break;
      case 'ศูนย์พณิชยการพระนคร':
        backgroundColor = '#2ecc71'; // Green for ศูนย์พณิชยการพระนคร
        break;
      case 'ศูนย์พระนครเหนือ':
        backgroundColor = '#e74c3c'; // Red for ศูนย์พระนครเหนือ
        break;
      case 'ศูนย์โชติเวช':
        backgroundColor = '#f1c40f'; // Yellow for ศูนย์โชติเวช
        break;
      default:
        backgroundColor = '#95a5a6'; // Grey for undefined RoomCenters
    }
  
    // Return the style object to apply to the event
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

  // Function to handle clicking on an event (shows alert with booking details)
  const handleSelectEvent = (event) => {
    alert(`
      Booking Details:
      Room: ${event.RoomName}
      Name: ${event.Name}
      Phone: ${event.Phone}
      Reason: ${event.Reason}
      Date: ${new Date(event.start).toLocaleDateString()}
      Time: ${new Date(event.start).toLocaleTimeString()} - ${new Date(event.end).toLocaleTimeString()}
    `);
  };

  // Filter events based on the selected center
  const filteredEvents = selectedCenter 
    ? events.filter(event => event.RoomCenter === selectedCenter) // If a center is selected, filter events by that center
    : events; // Otherwise, show all events

  return (
    <div className="App">
      <Navbar /> {/* Navigation bar component */}
      <div className="container-fluid" style={{ marginTop: '20px' }}>
        <h1 className="text-center mb-4">Booking Calendar</h1>
        
        {/* Badges for filtering events by RoomCenter */}
        <div className="row justify-content-end mb-2">
          <div className="col-auto">
            <span 
              className='badge' 
              style={{background:'#3498db', fontSize:'13px', color:'black', cursor: 'pointer'}}
              onClick={() => setSelectedCenter('ศูนย์เทเวศร์')} // Set selected center to 'ศูนย์เทเวศร์'
            >
              ศูนย์เทเวศร์
            </span>
          </div>
          <div className="col-auto">
            <span 
              className='badge' 
              style={{background:'#2ecc71', fontSize:'13px', color:'black', cursor: 'pointer'}}
              onClick={() => setSelectedCenter('ศูนย์พณิชยการพระนคร')} // Set selected center to 'ศูนย์พณิชยการพระนคร'
            >
              ศูนย์พณิชยการพระนคร
            </span>
          </div>
          <div className="col-auto">
            <span 
              className='badge' 
              style={{background:'#e74c3c', fontSize:'13px', color:'black', cursor: 'pointer'}}
              onClick={() => setSelectedCenter('ศูนย์พระนครเหนือ')} // Set selected center to 'ศูนย์พระนครเหนือ'
            >
              ศูนย์พระนครเหนือ
            </span>
          </div>
          <div className="col-auto">
            <span 
              className='badge' 
              style={{background:'#f1c40f', fontSize:'13px', color:'black', cursor: 'pointer'}}
              onClick={() => setSelectedCenter('ศูนย์โชติเวช')} // Set selected center to 'ศูนย์โชติเวช'
            >
              ศูนย์โชติเวช
            </span>
          </div>
          <div className="col-auto">
            <span 
              className='badge' 
              style={{background:'#95a5a6', fontSize:'13px', color:'black', cursor: 'pointer'}}
              onClick={() => setSelectedCenter(null)} // Reset filter when clicking "All Centers"
            >
              All Centers
            </span>
          </div>
        </div>
        
        <div className="row">
          <div className="col-12">
            <Calendar className='calenda-size'
              localizer={localizer}
              events={filteredEvents} // Use filtered events based on selected center
              startAccessor="start"
              endAccessor="end"
              titleAccessor="title"
              
              eventPropGetter={eventStyleGetter} // Apply custom styles to events
              components={{
                toolbar: CustomToolbar // Use the custom toolbar component
              }}
              onSelectEvent={handleSelectEvent} // Handle event selection (click)
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
