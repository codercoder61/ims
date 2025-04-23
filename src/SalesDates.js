import React, { useEffect, useState } from 'react';
import Menu from './Menu';
import { useNavigate } from 'react-router-dom';
//import { useLocation } from 'react-router-dom';


function Users() {
    const navigate = useNavigate();
    //const location = useLocation();
    const [users, setUsers] = useState([]);
    //const data = location.state;
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Calculate totalPrice on the fly
        //const updatedQty = value;
        //const updatedTotalPrice = responseText.buying_price * updatedQty;
      
        // Update formDataa with new qty and calculated totalPrice
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    };
    const [formData, setFormData] = useState({
                date1: '',
                date2:''
              });
    useEffect(() => {
        if (!localStorage.getItem('username')) {
            navigate('/');
        }
    }, [navigate]);

    /*if (data) {
        localStorage.setItem('role', data.role); // Save the theme in localStorage
        localStorage.setItem('username', data.username); // Save the theme in localStorage
    }*/
    const deleteUser = (id) => {
        // Send data to PHP via a POST request
        //console.log(id);  // For debugging
    
        fetch('https://soc-net.info/api/deleteUser.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Set content type to JSON
            },
            body: JSON.stringify({ id: id }),  // Send data as a JSON object
    
        })
            .then(response => response.json())  // Assuming your PHP returns a JSON response
            .then(data => {
                console.log(data);  // Handle the response from PHP
                // Optionally reload the page
                window.location.reload(true);  // Force reload from the server
            })
            .catch((error) => {
                console.error('Error:', error);  // Handle any errors
            });
    };
    const editUser = (id) => {
        navigate(`/edituser?id=${id}`);
    };
    useEffect(() => {
        fetch('https://soc-net.info/api/getUsers.php')
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setUsers(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);
    const handleClick = ()=>{
        navigate(`/report?date1=${formData.date2}&date2=${formData.date1}`)
    }
    return (
        <>
            <Menu />
            <div id="anel">
                <h1>Date Range</h1>
                <input name="date1" onChange={handleChange} value={formData.date1} type="date"/><span> to </span><input value={formData.date2} name="date2" onChange={handleChange} type="date"/><br/><br/>
                <button onClick={handleClick}>Generate Report</button>
            </div>
        </>
    );
}

export default Users;
