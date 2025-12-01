import React from 'react'
import { NavLink } from 'react-router-dom';

function Navbar({ role }) {
  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-dark px-3'>
      <NavLink className='navbar-brand' to="/">Mywebsite</NavLink>
      <div className="collapse navbar-collapse show">
        <ul className='navbar-nav ms-auto'>

          {
            !role ? (<>
              <li className='nav-item'><NavLink className='nav-link text-white' to="/"> Home</NavLink></li>
              <li className='nav-item'><NavLink className='nav-link text-white' to="/Register">Register</NavLink></li>
              <li className='nav-item'><NavLink className='nav-link text-white' to="/Products">Products</NavLink></li>
              <li className='nav-item'><NavLink className='nav-link text-white' to="/Login">Login</NavLink></li>
              <li className='nav-item'><NavLink className='nav-link text-white' to="/Cart">Cart</NavLink></li>
            </>) :
              role == "user" ? (<>
                {/* Purchase */}
                <li className='nav-item'><NavLink className='nav-link text-white' to="/">Home</NavLink></li>
                <li className='nav-item'><NavLink className='nav-link text-white' to="/Products">Products</NavLink></li>
                <li className='nav-item'><NavLink className='nav-link text-white' to="/Cart">Cart</NavLink></li>
                <li className='nav-item'><NavLink className='nav-link text-white' to="/Purchase">Purchase</NavLink></li>
                <li className='nav-item'><NavLink className='nav-link text-white' to="/Logout">Logout</NavLink></li>
              </>) : (
                <>
                  <li className='nav-item'><NavLink className='nav-link text-white' to="/Addproduct">Addproduct</NavLink></li>
                  <li className='nav-item'><NavLink className='nav-link text-white' to="/Adminusers">UserList</NavLink></li>
                  <li className='nav-item'><NavLink className='nav-link text-white' to="/AdminCategory">ProductList</NavLink></li>
                  <li className='nav-item'><NavLink className='nav-link text-white' to="/Adminpurchase">Purchase</NavLink></li>
                  <li className='nav-item'><NavLink className='nav-link text-white' to="/Logout">Logout</NavLink></li>
                </>
              )
          }

          {/* <li className='nav-item'><NavLink className='nav-link text-white' to="/">Home</NavLink></li>
          <li className='nav-item'><NavLink className='nav-link text-white' to="/Register">Register</NavLink></li>
          <li className='nav-item'><NavLink className='nav-link text-white' to="/Addproduct">Addproduct</NavLink></li>
          <li className='nav-item'><NavLink className='nav-link text-white' to="/Login">Login</NavLink></li> */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
