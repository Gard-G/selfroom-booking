import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './App.css';
import Navbar from './components/nevbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap'; // นำเข้า Modal และ Button


const localizer = momentLocalizer(moment); // Initialize moment localizer for calendar

// ฟังก์ชันแปลงปี ค.ศ. เป็น พ.ศ.
const formatDateInThai = (date) => {
  const thaiDate = new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'long',
  }).format(date);

  // เปลี่ยนปี ค.ศ. เป็น พ.ศ. โดยบวก 543
  const [month, year] = thaiDate.split(' ');
  const thaiYear = parseInt(year) ;
  return `${month} ${thaiYear}`;
};


// Custom toolbar component for the calendar
function CustomToolbar(props) {
  const goToView = (view) => {
    props.onView(view); // Switch calendar view (Month, Day, Agenda)
  };

  const thaiYearLabel = formatDateInThai(props.date);

  return (
    <div className='container'>
    <div className="rbc-toolbar">
      <span className=" rbc-btn-group mb-2">
        {/* Custom Previous Button */}
        <button 
          type="button" 
          style={{ backgroundColor: '#007bff', color: '#fff' }} // Custom button styles
          onClick={() => props.onNavigate('PREV')} // Navigate to previous view (e.g., previous month)
        >
          {"<"}
        </button>

         {/* Custom Next Button */}
         <button type="button" style={{ backgroundColor: '#007bff', color: '#fff' }} onClick={() => props.onNavigate('NEXT')}>
          {">"}
        </button>


        {/* Custom Today Button */}
        <button type="button" style={{ backgroundColor: '#007bff', color: '#fff' }} onClick={() => props.onNavigate('TODAY')}>
          วันนี้
        </button>
      </span>

      

      {/* Calendar Label (e.g., Month/Year) */}
      <span className="rbc-toolbar-label"><h3>{thaiYearLabel}</h3></span>

      <span className="rbc-btn-group">
        {/* View Buttons */}
        <button type="button" style={{ backgroundColor: '#007bff', color: '#fff' }} onClick={() => goToView('month')}>เดือน</button>
        <button type="button" style={{ backgroundColor: '#007bff', color: '#fff' }} onClick={() => goToView('day')}>วัน</button>
        <button type="button" style={{ backgroundColor: '#007bff', color: '#fff' }} onClick={() => goToView('agenda')}>กำหนดการ</button>
      </span>
    </div>
    </div>
  );
}

function App() {
  const [events, setEvents] = useState([]); // State to store events from the API
  const [selectedCenter, setSelectedCenter] = useState(null); // State to track the selected center for filtering
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [selectedEvent, setSelectedEvent] = useState(null); // State to store the selected event
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      setIsAdmin(false);
    } else {
      setIsLoggedIn(true);
      axios
        .get('/api/user-info', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
          setIsAdmin(response.data.IDstatus === 'admin');
        })
        .catch(error => {
          console.error('Error verifying user:', error);
        });
    }
  }, []);

  // Fetch events from the backend API on component mount
  useEffect(() => {
    axios.get('/api/bookings')
      .then(response => {
        const formattedEvents = response.data
          .filter(booking => booking.Status === 'booking') // ฟิลเตอร์เฉพาะการจองที่มีสถานะ 'booking'
          .map(booking => {
            // สร้าง Date object สำหรับวันและเวลาเริ่มต้น
            const startDate = new Date(booking.StartDate); // วันเริ่มต้น
            const startTime = booking.Start.split(':'); // แยกเวลาที่เริ่ม
            startDate.setHours(startTime[0], startTime[1]); // ตั้งค่าชั่วโมงและนาที
  
            // สร้าง Date object สำหรับวันและเวลาสิ้นสุด
            const endDate = new Date(booking.EndDate); // วันสิ้นสุด
            const endTime = booking.End.split(':'); // แยกเวลาที่สิ้นสุด
            endDate.setHours(endTime[0], endTime[1]); // ตั้งค่าชั่วโมงและนาที
  
            return {
              title: `${booking.RoomName} - ${booking.Reason}`, // ชื่อเหตุการณ์
              start: startDate,
              end: endDate,
              RoomCenter: booking.RoomCenter, // เก็บชื่อศูนย์ห้องสำหรับการกรอง
              ...booking // เก็บวัตถุการจองทั้งหมดเพื่อใช้งานในภายหลัง
            };
          });
  
        setEvents(formattedEvents); // อัปเดตสถานะด้วยเหตุการณ์ที่จัดรูปแบบแล้ว
      })
      .catch(error => {
        console.error('Error fetching bookings:', error); // จัดการกับข้อผิดพลาดระหว่างการเรียก API
      });
  }, []);
    // Empty dependency array means this effect runs once when the component mounts

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
    setSelectedEvent(event); // Set the selected event
    setShowModal(true); // Show the modal
  };

    // Function to handle modal close
    const handleCloseModal = () => setShowModal(false);

  // Filter events based on the selected center
  const filteredEvents = selectedCenter 
    ? events.filter(event => event.RoomCenter === selectedCenter) // If a center is selected, filter events by that center
    : events; // Otherwise, show all events

    const renderEventDetails = event => {
      if (!isLoggedIn) {
        return <p><strong></strong> </p>;
      }
      if (!isAdmin) {
        return <p><strong></strong> </p>;
      }
      return (
        <>
          <p><strong>ชื่อ-นามสกุล:</strong> {event.Name}</p>
          <p><strong>เบอร์โทร:</strong> {event.Phone}</p>
        </>
      );
    };

  return (
    <div className="App">
      <Navbar /> {/* Navigation bar component */}

      <div className="container-fluid" style={{ marginTop: '40px' }}>
        <div style={{padding: '35px' , backgroundColor:'#4169e1' ,alignContent: 'center',boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.6)'}}>
        <h1 className="" style={{backgroundColor: '#4169e1', color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'}}>ระบบจองห้อง SELF</h1>
        </div>
        {/* Badges for filtering events by RoomCenter */}
        <div className="row justify-content-end mb-3 mt-3">
          <div className="col-auto">
            <span 
              className='badge ' 
              style={{background:'#3498db', fontSize:'14.5px', color:'black', cursor: 'pointer', marginRight: '7px'}}
              onClick={() => setSelectedCenter('ศูนย์เทเวศร์')} // Set selected center to 'ศูนย์เทเวศร์'
            >
              เทเวศร์
            </span>

            <span 
              className='badge' 
              style={{background:'#2ecc71', fontSize:'14.5px', color:'black', cursor: 'pointer', marginRight: '7px'}}
              onClick={() => setSelectedCenter('ศูนย์พณิชยการพระนคร')} // Set selected center to 'ศูนย์พณิชยการพระนคร'
            >
              พณิชยการพระนคร
            </span>

            <span 
              className='badge' 
              style={{background:'#e74c3c', fontSize:'14.5px', color:'black', cursor: 'pointer', marginRight: '7px'}}
              onClick={() => setSelectedCenter('ศูนย์พระนครเหนือ')} // Set selected center to 'ศูนย์พระนครเหนือ'
            >
              พระนครเหนือ
            </span>

            <span 
              className='badge' 
              style={{background:'#f1c40f', fontSize:'14.5px', color:'black', cursor: 'pointer', marginRight: '7px'}}
              onClick={() => setSelectedCenter('ศูนย์โชติเวช')} // Set selected center to 'ศูนย์โชติเวช'
            >
              โชติเวช
            </span>

            <span 
              className='badge' 
              style={{background:'#95a5a6', fontSize:'14.5px', color:'black', cursor: 'pointer'}}
              onClick={() => setSelectedCenter(null)} // Reset filter when clicking "All Centers"
            >
              ศูนย์ทั้งหมด
            </span>
          </div>   
        </div>
        
         {/* Calendar component */}
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

        {/* Modal for event details */}
<Modal show={showModal} onHide={handleCloseModal} centered>
  <Modal.Header closeButton>
    <Modal.Title>รายละเอียดการจอง</Modal.Title>
  </Modal.Header>
  <Modal.Body>
            {selectedEvent && (
              <div>
                {renderEventDetails(selectedEvent)}
                <p><strong>ชื่อห้อง:</strong> {selectedEvent.RoomName}</p>
                <p><strong>ใช้ทำอะไร:</strong> {selectedEvent.Reason}</p>
                <p>
                  <strong>วันที่:</strong>{' '}
                  {moment(selectedEvent.start).format('DD/MM/YYYY')} -{' '}
                  {moment(selectedEvent.end).format('DD/MM/YYYY')}
                </p>
                <p>
                  <strong>เวลา:</strong>{' '}
                  {moment(selectedEvent.start).format('HH:mm')} -{' '}
                  {moment(selectedEvent.end).format('HH:mm')}
                </p>
                
              </div>
            )}
          </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseModal}>
      ปิด
    </Button>
  </Modal.Footer>
</Modal>

      </div>
    </div>
  );
}

export default App;
