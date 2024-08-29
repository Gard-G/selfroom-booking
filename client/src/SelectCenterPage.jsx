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
      <div className="row text-center" style={{marginTop: '0px'}}>
        <h1 className="my-4">เลือกศูนย์ที่จะจอง</h1>
        <div className="col-md-3 mb-4">
          <div className="card" onClick={() => handleCenterClick('ศูนย์เทเวศร์')}>
            <img style={{height:'25vh',}}
              src="src/image/IMG_6489-2.jpg" // Replace with your image path
              className="card-img-top"
              alt="ศูนย์เทเวศร์"
            />
            <div className="card-body">
              <h4 className="card-title">ศูนย์เทเวศร์</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card" onClick={() => handleCenterClick('ศูนย์พณิชยการพระนคร')}>
            <img style={{height:'25vh'}}
              src="src/image/IMG_6489-2.jpg" // Replace with your image path
              className="card-img-top"
              alt="ศูนย์พณิชยการพระนคร"
            />
            <div className="card-body">
              <h4 className="card-title">ศูนย์พณิชยการพระนคร</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card" onClick={() => handleCenterClick('ศูนย์พระนครเหนือ')}>
            <img style={{height:'25vh'}}
              src="src/image/IMG_6489-2.jpg" // Replace with your image path
              className="card-img-top"
              alt="ศูนย์พระนครเหนือ"
            />
            <div className="card-body">
              <h4 className="card-title">ศูนย์พระนครเหนือ</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card" onClick={() => handleCenterClick('ศูนย์โชติเวช')}>
            <img style={{height:'25vh'}}
              src="src/image/IMG_6489-2.jpg" // Replace with your image path
              className="card-img-top"
              alt="ศูนย์โชติเวช"
            />
            <div className="card-body">
              <h4 className="card-title">ศูนย์โชติเวช</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectCenterPage;
