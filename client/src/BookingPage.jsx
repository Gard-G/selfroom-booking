import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Navbar from './components/nevbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactFlatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Thai } from 'flatpickr/dist/l10n/th.js'; // นำเข้า locale ภาษาไทย
import moment from 'moment-timezone';  // เพิ่มการนำเข้า moment-timezone

const BookingPage = () => {
  const [room, setRoom] = useState(null);
  const [bookingType, setBookingType] = useState('range');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const selectedRoomID = queryParams.get('room');

  useEffect(() => {
    axios.get(`/api/rooms/${selectedRoomID}`)
      .then(response => setRoom(response.data))
      .catch(error => console.error('Error fetching room details:', error));
  }, [selectedRoomID]);

  // ฟังก์ชันแปลงวันที่ให้เป็นเวลาไทย
  const convertToThaiDate = (date) => {
    return moment(date).tz('Asia/Bangkok').format('YYYY-MM-DD'); // แปลงเป็นเวลาไทย
  };

  // ฟังก์ชันแปลงเวลาให้เป็นรูปแบบ HH:mm
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!startTime || !endTime || !name || !phone || !reason) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (startTime >= endTime) {
      toast.error('เวลาเริ่มต้องน้อยกว่าเวลาสิ้นสุด');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      if (bookingType === 'range') {
        if (!startDate || !endDate) {
          toast.error('กรุณากรอกวันที่เริ่มและวันที่สิ้นสุด');
          return;
        }
        if (new Date(endDate) < new Date(startDate)) {
          toast.error('วันที่สิ้นสุดต้องมากกว่าวันที่เริ่ม');
          return;
        }

        const response = await axios.post('/api/bookings', {
          RoomID: selectedRoomID,
          StartDate: startDate,
          EndDate: endDate,
          StartTime: startTime,
          EndTime: endTime,
          Name: name,
          Phone: phone,
          Reason: reason,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success(response.data);
      } else if (bookingType === 'weekly') {
        if (!dayOfWeek || !startDate || !endDate) {
          toast.error('กรุณากรอกข้อมูลวันและช่วงเดือน');
          return;
        }

        const response = await axios.post('/api/bookings/weekly', {
          RoomID: selectedRoomID,
          DayOfWeek: dayOfWeek,
          StartMonth: startDate,
          EndMonth: endDate,
          StartTime: startTime,
          EndTime: endTime,
          Name: name,
          Phone: phone,
          Reason: reason,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success(response.data);
      }

      // Clear form after successful submission
      setStartDate('');
      setEndDate('');
      setDayOfWeek('');
      setStartTime('');
      setEndTime('');
      setName('');
      setPhone('');
      setReason('');
    } catch (error) {
      console.error('Error creating booking:', error.response?.data || error.message);
      toast.error(error.response?.data || 'การจองล้มเหลว');
    }
  };

  return (
    <div className="container">
      <Navbar />
      <div className="mb-5"></div>
      <div className="card card-container bg-dark text-white">
        <h1 className="mt-4 mb-4">จองห้อง {room ? room.RoomName : ''}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="bookingType">ประเภทการจอง:</label>
            <select
              id="bookingType"
              className="form-control"
              value={bookingType}
              onChange={(e) => setBookingType(e.target.value)}
            >
              <option value="range">แบบช่วงวันที่</option>
              <option value="weekly">แบบรายสัปดาห์ (ทั้งเดือน)</option>
            </select>
          </div>

          {bookingType === 'range' && (
            <>
              <div className='row'>
                <div className="form-group mb-3 col-lg-6 col-12">
                  <label htmlFor="startDate">วันที่เริ่ม:</label>
                  <ReactFlatpickr
                    id="startDate"
                    value={startDate}
                    onChange={([date]) => setStartDate(convertToThaiDate(date))} // แปลงวันที่เป็นเวลาไทย
                    options={{
                      locale: Thai,
                      dateFormat: "Y-m-d",
                    }}
                    className="form-control"
                  />
                </div>
                <div className="form-group mb-3 col-lg-6 col-12">
                  <label htmlFor="endDate">วันที่สิ้นสุด:</label>
                  <ReactFlatpickr
                    id="endDate"
                    value={endDate}
                    onChange={([date]) => setEndDate(convertToThaiDate(date))} // แปลงวันที่เป็นเวลาไทย
                    options={{
                      locale: Thai,
                      dateFormat: "Y-m-d",
                    }}
                    className="form-control"
                  />
                </div>
              </div>
            </>
          )}

          {bookingType === 'weekly' && (
            <>
              <div className="form-group mb-3">
                <label htmlFor="dayOfWeek">เลือกวันในสัปดาห์:</label>
                <select
                  id="dayOfWeek"
                  className="form-control"
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                >
                  <option value="">-- กรุณาเลือก --</option>
                  <option value="Monday">วันจันทร์</option>
                  <option value="Tuesday">วันอังคาร</option>
                  <option value="Wednesday">วันพุธ</option>
                  <option value="Thursday">วันพฤหัสบดี</option>
                  <option value="Friday">วันศุกร์</option>
                  <option value="Saturday">วันเสาร์</option>
                  <option value="Sunday">วันอาทิตย์</option>
                </select>
              </div>

              <div className="row">
                <div className="form-group mb-3 col-lg-6 col-12">
                  <label htmlFor="startMonth">เดือนเริ่มต้น:</label>
                  <input
                    id="startMonth"
                    type="month"
                    className="form-control"
                    value={startDate}
                    min={new Date().toISOString().slice(0, 7)}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="form-group mb-3 col-lg-6 col-12">
                  <label htmlFor="endMonth">เดือนสิ้นสุด:</label>
                  <input
                    id="endMonth"
                    type="month"
                    className="form-control"
                    value={endDate}
                    min={startDate || new Date().toISOString().slice(0, 7)}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="row">
            <div className="form-group mb-3 col-lg-6 col-12">
              <label htmlFor="startTime">เวลาเริ่ม:</label>
              <ReactFlatpickr
                id="startTime"
                value={startTime}
                onChange={([date]) => setStartTime(formatTime(date))}
                options={{
                  enableTime: true,
                  noCalendar: true,
                  dateFormat: "H:i",
                  time_24hr: true,
                }}
                className="form-control"
              />
            </div>
            <div className="form-group mb-3 col-lg-6 col-12">
              <label htmlFor="endTime">จนถึง:</label>
              <ReactFlatpickr
                id="endTime"
                value={endTime}
                onChange={([date]) => setEndTime(formatTime(date))}
                options={{
                  enableTime: true,
                  noCalendar: true,
                  dateFormat: "H:i",
                  time_24hr: true,
                }}
                className="form-control"
              />
            </div>
          </div>

          <div className="form-group mb-3">
            <label htmlFor="name">ชื่อ-นามสกุล:</label>
            <input
              id="name"
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="phone">เบอร์โทร:</label>
            <input
              id="phone"
              type="text"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="reason">ใช้ทำอะไร:</label>
            <textarea
              id="reason"
              className="form-control"
              rows="3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-success btn-block">
            จองห้อง
          </button>
        </form>

        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </div>
    </div>
  );
};

export default BookingPage;
