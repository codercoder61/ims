import React, { useState,useEffect, useRef } from 'react';
import './Menu.css';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Menu() {
  //const navigate = useNavigate();
  const dropdownBtns = useRef([]);
  const myDropdown = useRef(null);

  //const location = useLocation();
  //const data = location.state;
  const [dateTime, setDateTime] = useState(new Date());
  const toggle = ()=>
  {
      if(myDropdown.current.style.display!="block")
      {
        myDropdown.current.style.display="block"
      }
      else{
        myDropdown.current.style.display="none"
      }
  }
  // Update the date and time every second
  useEffect(() => {
    /*if(!localStorage.getItem('username')){
      navigate('/');
    }*/
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);
  const formattedDate = dateTime.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, // Use 12-hour format with AM/PM
  });
  

  window.onclick = function(event) {
    if (!event.target.matches('#myDropdown') && !event.target.matches('.dropbtn')) {
      if(myDropdown.current)
        myDropdown.current.style.display="none"
    }
  }
  
  useEffect(() => {
    const handleDropdownClick = (e) => {
      const dropdownContent = e.target.nextElementSibling;
      const isActive = e.target.classList.contains("active");

      // Toggle active class and dropdown content display
      e.target.classList.toggle("active", !isActive);
      dropdownContent.style.display = isActive ? "none" : "block";
    };

    // Attach the event listener to all dropdown buttons
    dropdownBtns.current.forEach((btn) => {
      btn.addEventListener("click", handleDropdownClick);
    });

  }, []);

  return (
    <div className="sidenav">
      <div className="user"><p style={{fontWeight:'bold'}}>{formattedDate}</p><div style={{fontWeight:'bold'}}><div class="dropdown">
    <button onClick={toggle} class="dropbtn"> {localStorage.getItem('username')}<i class="fa fa-caret-down"></i>
    </button>
    <div ref={myDropdown} id="myDropdown" class="dropdown-content">
      <Link to="/">Logout</Link>
    </div>
  </div>
</div></div>
      <div id="logo">Inventory System</div>
      <div>
      
      <Link to="/dashboard">Dashboard</Link> 
        {localStorage.getItem('role') && localStorage.getItem('role')=='admin' && <>
        
        
        <button
          className="dropdown-btn"
          ref={(el) => dropdownBtns.current.push(el)} // Pushing each dropdown button to the ref array
        >
          User Nanagement 
          
        </button>
      
        <div className="dropdown-container">
          <Link to="/users">Manage Users</Link>
        </div>
        <Link to="/categories">Categories</Link>
        <button
          className="dropdown-btn"
          ref={(el) => dropdownBtns.current.push(el)} // Pushing each dropdown button to the ref array
        >
          Products 
          
        </button>
        
        <div className="dropdown-container">
          <Link to="/products">Manage Products</Link>
          <Link to="/addproduct">Add Products</Link>
        </div></>}
        <button
          className="dropdown-btn"
          ref={(el) => dropdownBtns.current.push(el)} // Pushing each dropdown button to the ref array
        >
          Sales
        </button>
        
        <div className="dropdown-container">
          <Link to="/sales">Manage Sales</Link>
          <Link to="/addsale">Add Sales</Link>
        </div>
        <button
          className="dropdown-btn"
          ref={(el) => dropdownBtns.current.push(el)} // Pushing each dropdown button to the ref array
        >
          Sales Report
          
        </button>
        
        <div className="dropdown-container">
          <Link to="/sales_dates">Sales by dates</Link>
        </div>
      </div>
    </div>
  );
}

export default Menu;
