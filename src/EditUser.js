import React, { useState,useEffect } from 'react'
import "./AddUser.css"
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function EditUser() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const param1 = queryParams.get('id');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role:'admin',
        id:param1
      });
      useEffect(() => {
          if(!localStorage.getItem('role')){
            navigate('/');
          }
        }, []);

        useEffect(() => {
                  
                  const fetchUser = async () => {
                     
                    try {
                  
                      
                      const response = await fetch('https://soc-net.info/api/getUser.php', {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/text',
                          },
                          body: JSON.stringify({ idUser: param1 }),
                      });
                  
                      if (!response.ok) {
                          throw new Error(`https error! status: ${response.status}`);
                      }
                  
                      const responseData = await response.text();
                      console.log(JSON.parse(responseData)); // Attempt to parse as JSON
                      setFormData({
                        ...formData,
                        username: responseData.username,
                        password: responseData.password,
                        role:responseData.role,
                      });
                      console.log(responseData);  // Handle the response data (e.g., display a message)
                      //setResponseMessage("User updated successfully!");
                     
                      
                  } catch (error) {
                      console.error('Error:', error);
                      setResponseMessage("Failed to edit category.");
                  }
                  
                };
        
                fetchUser()
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
          const response = await fetch('https://soc-net.info/api/EditUser.php', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
          });
      
          if (!response.ok) {
              throw new Error(`https error! status: ${response.status}`);
          }
      
          const responseData = await response.json();
          if(responseData.message=="Record updated successfully.")
          {
            setResponseMessage("User updated successfully.");
        }
          console.log(responseData);  // Handle the response data (e.g., display a message)
          //setResponseMessage("User updated successfully!");
      } catch (error) {
          console.error('Error:', error);
          setResponseMessage("Failed to edit user.");
      }
      
    };
    
    
  return (
    <div id="panel">
      <Link to="/users"><h1 style={{textAlign:'center',color:"black",textDecoration:"none"}}>Edit User Panel</h1></Link>
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
        <input type="submit" value="Edit"/>
      </form>
      {responseMessage && <p style={{marginTop:"10px"}}>{responseMessage}</p>}
    </div>
  )
}

export default EditUser
