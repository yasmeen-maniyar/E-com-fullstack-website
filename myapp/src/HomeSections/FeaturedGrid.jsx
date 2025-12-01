import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./FeaturedGrid.css";

import watch2 from "../assets/images/img-2.png";
import watch3 from "../assets/images/img-3.png";
import watch4 from "../assets/images/img-4.png";
import watch5 from "../assets/images/img-5.png";

function FeaturedGrid() {
  return (
    <div className="home-sections py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-6 d-flex flex-column gap-4">
            <div className="grid-box short-box text-center">
              <img src={watch2} alt="" className="grid-img mb-3" />
              <h5>From $250.00</h5>
              <p className="text-muted">KOBOLD HIMALAYA</p>
              {/* <button className="btn btn-outline-dark btn-sm mt-2">MORE DETAIL</button> */}
            </div>


            <div className="grid-box tall-box text-center">
              <img src={watch4} alt="" className="grid-img mb-3" />
              <h5>NEW KOBOLD WATCH</h5>
              <p className="text-muted">
                Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie.
              </p>
            </div>
          </div>

          <div className="col-md-6 d-flex flex-column gap-4">
            <div className="grid-box tall-box text-center">
              <img src={watch3} alt="" className="grid-img mb-3" />
              <h5>KOBOLD EXPEDITION LEATHER WATCHES</h5>
              <p className="text-muted">Awesome, Luxury & Elegant</p>
            </div>

            <div className="grid-box short-box text-center">
              <img src={watch5} alt="" className="grid-img mb-3" />
              <h5>THE HORSE CREATIVE SHOW</h5>
              <p className="text-muted">All in tonight</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedGrid;



