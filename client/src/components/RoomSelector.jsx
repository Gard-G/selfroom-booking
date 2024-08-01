// src/components/RoomSelector.jsx
import React from 'react';

const RoomSelector = ({ rooms, selectedRoom, onSelect }) => {
  return (
    <div className="room-selector">
      <label htmlFor="room">Select Room:</label>
      <select id="room" value={selectedRoom} onChange={(e) => onSelect(e.target.value)}>
        <option value="">Select a room</option>
        {rooms.map(room => (
          <option key={room.RoomID} value={room.RoomID}>
            {room.RoomName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RoomSelector;
