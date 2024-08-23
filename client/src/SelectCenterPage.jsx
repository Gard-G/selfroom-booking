import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/nevbar';

const SelectCenterPage = () => {
  const navigate = useNavigate();

  const handleCenterClick = (center) => {
    navigate(`/booking?center=${center}`); // Redirect to booking page with selected center as a query parameter
  };

  return (
    <div className="container">
        <Navbar/>
      <div className="row text-center">
        <h1 className="my-4">Select a Center</h1>
        <div className="col-md-6 mb-4">
          <div className="card" onClick={() => handleCenterClick('ศูนย์เทเวศร์')}>
            <img
              src="src/image/IMG_6489-2.jpg" // Replace with your image path
              className="card-img-top"
              alt="ศูนย์เทเวศร์"
            />
            <div className="card-body">
              <h5 className="card-title">ศูนย์เทเวศร์</h5>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card" onClick={() => handleCenterClick('ศูนย์พณิชยการพระนคร')}>
            <img
              src="src/image/IMG_6489-2.jpg" // Replace with your image path
              className="card-img-top"
              alt="ศูนย์พณิชยการพระนคร"
            />
            <div className="card-body">
              <h5 className="card-title">ศูนย์พณิชยการพระนคร</h5>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card" onClick={() => handleCenterClick('ศูนย์พระนครเหนือ')}>
            <img
              src="src/image/IMG_6489-2.jpg" // Replace with your image path
              className="card-img-top"
              alt="ศูนย์พระนครเหนือ"
            />
            <div className="card-body">
              <h5 className="card-title">ศูนย์พระนครเหนือ</h5>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card" onClick={() => handleCenterClick('ศูนย์โชติเวช')}>
            <img
              src="src/image/IMG_6489-2.jpg" // Replace with your image path
              className="card-img-top"
              alt="ศูนย์โชติเวช"
            />
            <div className="card-body">
              <h5 className="card-title">ศูนย์โชติเวช</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectCenterPage;
