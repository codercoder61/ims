import React, { useState,useEffect } from 'react'
import "./AddUser.css"
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function AddUser() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role:'admin'
      });
      useEffect(() => {
          if(!localStorage.getItem('role') && localStorage.getItem('role')!="adduser"){
            navigate('/');
          }
        }, []);
      const [responseMessage, setResponseMessage] = useState('');
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
          console.log(formData);
      
          // Check if formData is an instance of FormData and convert it to a plain object
          const data = {};
          if (formData instanceof FormData) {
              formData.forEach((value, key) => {
                  data[key] = value;
              });
          } else if (typeof formData === 'object' && formData !== null) {
              // If formData is already an object, directly use it
              Object.entries(formData).forEach(([key, value]) => {
                  data[key] = value;
              });
          } else {
              throw new Error("formData is neither FormData nor an object.");
          }
      
          // Send data as JSON to the PHP script
          const response = await fetch('http://soc-net.info/api/AddUser.php', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
          });
      
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const responseData = await response.json();
          console.log(responseData);  // Handle the response data (e.g., display a message)
          setResponseMessage("User added successfully!");
      } catch (error) {
          console.error('Error:', error);
          setResponseMessage("Failed to add user.");
      }
      
    };
    
    
  return (
    <div id="body">
    <div id="panel">
      <Link to="/"><h1 style={{textAlign:'center',color:"black",textDecoration:"none"}}>Add User Panel</h1></Link>
      <h4 style={{textAlign:'center',marginBottom:'10px'}}>Inventory Management System</h4>
      <form onSubmit={handleSubmit} action="" method="POST">
        <label>Username</label><br/>
        <input required id="username" value={formData.username} onChange={handleChange} type="text" placeholder="Username" name="username"/><br/>
        <label>Password</label><br/>
        <input required id="password" value={formData.password} onChange={handleChange} type="password" placeholder="Password" name="password"/><br/>
        <label>Role</label><br/>   
        <select required id="role" name="role" value={formData.role} onChange={handleChange}>
            <option value="admin">Admin</option>
            <option value="user">Normal User</option>
        </select>
        <br/><br/>
        <input type="submit" value="Login"/>
      </form>
      {responseMessage && <p style={{marginTop:"10px"}}>{responseMessage}</p>}
    </div>
    </div>
  )
}

export default AddUser
