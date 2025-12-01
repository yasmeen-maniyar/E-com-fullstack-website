import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer py-5">
      <div className="container">
        <div className="row gy-4">

          <div className="col-md-4">
            <h4 className="footer-logo mb-3">Kobold Watches</h4>
            <p className="text-muted">
              Timeless designs crafted with precision and elegance. 
              Elevate your style with our exclusive collection.
            </p>
          </div>

          <div className="col-md-2">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled footer-links">
              <li><a href="#">Home</a></li>
              <li><a href="#">Shop</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          <div className="col-md-3">
            <h6 className="fw-bold mb-3">Support</h6>
            <ul className="list-unstyled footer-links">
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Shipping & Returns</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>

          <div className="col-md-3">
            <h6 className="fw-bold mb-3">Newsletter</h6>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit" className="btn btn-dark btn-sm mt-2 w-100">Subscribe</button>
            </form>
          </div>
        </div>

        <hr className="my-4" />

        <div className="text-center text-muted small">
          © 2025 Kobold Watches. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
