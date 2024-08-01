// src/components/DateTimePicker.jsx
import React, { useState } from 'react';

const DateTimePicker = ({ onDateChange, onTimeChange }) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleDateChange = (e) => {
    setDate(e.target.value);
    onDateChange(e.target.value);
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
    onTimeChange(e.target.value, endTime);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
    onTimeChange(startTime, e.target.value);
  };

  return (
    <div className="date-time-picker">
      <label htmlFor="date">Date:</label>
      <input
        type="date"
        id="date"
        value={date}
        onChange={handleDateChange}
      />

      <label htmlFor="start-time">Start Time:</label>
      <input
        type="time"
        id="start-time"
        value={startTime}
        onChange={handleStartTimeChange}
      />

      <label htmlFor="end-time">End Time:</label>
      <input
        type="time"
        id="end-time"
        value={endTime}
        onChange={handleEndTimeChange}
      />
    </div>
  );
};

export default DateTimePicker;
