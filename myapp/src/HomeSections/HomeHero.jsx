import React from 'react'
import "./HomeHero.css";
import images1 from "../assets/images/images-1.jpeg";

function HomeHero() {
  return (
    <div className="home-section">
      <div className="container">
        <div className="row align-items-center">

          <div className="col-md-6 text-center text-md-start">
            <p className="small-text">FOR YOUR LUXURY & ELEGANT</p>
            <h1 className="fw-bold">UNISEX LEATHER</h1>
            <p className="text-muted">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore magna aliqua erat volutpat.
            </p>
            <button className="btn btn-dark mt-3">DISCOVER NOW</button>
          </div>

          <div className="col-md-6 text-center">
            <img
              src={images1}
              alt="Unisex Leather Watch"
              className="img-fluid hero-watch"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeHero