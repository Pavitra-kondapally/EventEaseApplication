// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import './Navbar.css';

// const Navbar = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };


//   return (
//     <nav className="navbar">
//       <ul>
//         <li><Link to="/">Home</Link></li>
//         <li><Link to="/register">Register</Link></li>
//         <li><Link to="/login">Login</Link></li>
//         <li><Link to="/events">Events</Link></li>
//         <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;


import React, { useState } from "react";
import "./Navbar.css";
import { Link, NavLink , useNavigate} from "react-router-dom";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentImg, setCurrentImg] = useState({
    src: "https://res.cloudinary.com/duwadnxwf/image/upload/v1704953273/icons8-hamburger-50_2_c837d6.png",
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };


  const handleClick = () => {
    setCurrentImg((prevImg) => ({
      src:
        prevImg.src ===
        "https://res.cloudinary.com/duwadnxwf/image/upload/v1704953273/icons8-hamburger-50_2_c837d6.png"
          ? "https://res.cloudinary.com/duwadnxwf/image/upload/v1704953389/icons8-x-50_2_o0syv8.png"
          : "https://res.cloudinary.com/duwadnxwf/image/upload/v1704953273/icons8-hamburger-50_2_c837d6.png",
    }));
  };
  return (
    <nav>
      <Link to="/" className="title">
        <h1> EventEase</h1>
      </Link>
      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <img
          src={currentImg.src}
          alt="ham"
          className="ham"
          onClick={handleClick}
        ></img>
      </div>
      <ul className={menuOpen ? "open" : ""}>
        <li>
          <NavLink to="/Register">Register</NavLink>
        </li>
        <li>
          <NavLink to="/Login">Login</NavLink>
        </li>

        <li>
          <NavLink to="/Events">Events</NavLink>
        </li>

        <li>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
