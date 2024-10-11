import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/nevbar';
import axios from 'axios';

const SelectCenterPage = () => {
  const navigate = useNavigate();
  const [centers, setCenters] = useState([]);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert ('โปรดlogin')
          navigate('/login'); // Redirect to login if no token
          return;
        }
        
        // Fetch centers only if authenticated
        const response = await axios.get('/api/room-centers');
        setCenters(response.data);
      } catch (error) {
        console.error('Error verifying authentication or fetching centers:', error);
        navigate('/login'); // Redirect to login on error
      }
    };

    checkAuthentication();
  }, [navigate]);

  const handleCenterClick = (center) => {
    navigate(`/select-rooms?center=${center}`);
  };

  const getImageForCenter = (center) => {
    switch (center) {
      case 'ศูนย์เทเวศร์':
        return '/images/IMG_6489-2.jpg';
      case 'ศูนย์พณิชยการพระนคร':
        return '/images/bus_buiding2.jpg';
      case 'ศูนย์พระนครเหนือ':
        return '/images/bb1.jpg';
      case 'ศูนย์โชติเวช':
        return '/images/Screenshot 2024-09-27 113057.png';
      default:
        return '/images/IMG_6489-2.jpg';
    }
  };

  return (
    <div className="container">
      <Navbar />
      <div className="row text-center" style={{ marginTop: '0px' }}>
        <h1 className="my-4">เลือกศูนย์ที่จะจอง</h1>
        {centers.map((center, index) => (
          <div className="col-md-3 mb-4" key={index}>
            <div className="card" style={{ cursor: 'pointer' }}  onClick={() => handleCenterClick(center)}>
              <img 
                style={{ height: '25vh' }}
                src={getImageForCenter(center)}
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
