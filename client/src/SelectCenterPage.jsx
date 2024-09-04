import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/nevbar';
import axios from 'axios';

const SelectCenterPage = () => {
  const navigate = useNavigate();
  const [centers, setCenters] = useState([]);

  useEffect(() => {
    // Fetch centers from the server
    axios.get('/api/room-centers')
      .then(response => {
        setCenters(response.data);
      })
      .catch(error => {
        console.error('Error fetching centers:', error);
      });
  }, []);

  const handleCenterClick = (center) => {
    navigate(`/select-rooms?center=${center}`);
  };

  // Function to get the image based on the center name
  const getImageForCenter = (center) => {
    switch (center) {
      case 'ศูนย์เทเวศร์':
        return 'src/image/IMG_6489-2.jpg'; // Replace with the actual path
      case 'ศูนย์พณิชยการพระนคร':
        return 'src/image/IMG_6489-2.jpg'; // Replace with the actual path
      case 'ศูนย์พระนครเหนือ':
        return 'src/image/IMG_6489-2.jpg'; // Replace with the actual path
      case 'ศูนย์โชติเวช':
        return 'src/image/IMG_6489-2.jpg'; // Replace with the actual path
      default:
        return 'src/image/IMG_6489-2.jpg'; // Default image
    }
  };

  return (
    <div className="container">
      <Navbar />
      <div className="row text-center" style={{ marginTop: '0px' }}>
        <h1 className="my-4">เลือกศูนย์ที่จะจอง</h1>
        {centers.map((center, index) => (
          <div className="col-md-3 mb-4" key={index}>
            <div className="card" onClick={() => handleCenterClick(center)}>
              <img 
                style={{ height: '25vh' }}
                src={getImageForCenter(center)} // Use the dynamic image based on the center
                className="card-img-top"
                alt={center}
              />
              <div className="card-body">
                <h4 className="card-title">{center}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectCenterPage;
