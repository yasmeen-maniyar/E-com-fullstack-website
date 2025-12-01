import React from 'react';
import leftImg from "../assets/images/left-img.png";
import rightImg from "../assets/images/right-img.png";
import "./ShowcaseSection.css";
import { useNavigate } from 'react-router-dom';


function ShowcaseSection() {
const navigate = useNavigate();

  const goToProducts = () => {
    navigate("/products"); 
  }
  return (
    <section className="showcase-section py-5">
      <div className="container">
        <div className="row align-items-center">
          
          <div className="col-md-4 text-center mb-4 mb-md-0">
            <img src={leftImg} alt="Left Watch" className="showcase-img" />
          </div>

          <div className="col-md-4 text-center">
            <h2 className="fw-bold mb-3">Timeless Elegance</h2>
            <p className="text-muted mb-4">
              Experience unmatched craftsmanship and luxury with our exclusive collection.
            </p>
            <button className="btn btn-dark px-4" onClick={goToProducts}>Shop Now</button>
          </div>

          <div className="col-md-4 text-center mt-4 mt-md-0">
            <img src={rightImg} alt="Right Watch" className="showcase-img" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ShowcaseSection;
