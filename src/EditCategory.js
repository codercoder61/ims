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
        category: '',
        id:param1
      });
      useEffect(() => {
          if(!localStorage.getItem('role')){
            navigate('/');
          }
          const fetchCategory = async () => {
             
            try {
          
              let datas = {
                idCat : parseInt(param1)
              }
              const response = await fetch('https://soc-net.info/api/getCategory.php', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(datas),
              });
          
              if (!response.ok) {
                  throw new Error(`https error! status: ${response.status}`);
              }
          
              const responseData = await response.text();
              
              console.log(responseData);  // Handle the response data (e.g., display a message)
              //setResponseMessage("User updated successfully!");
              setFormData({
                ...formData,
                category: JSON.parse(responseData).category,
              });
              
          } catch (error) {
              console.error('Error:', error);
              setResponseMessage("Failed to edit category.");
          }
          
        };

        fetchCategory()
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
          const response = await fetch('https://soc-net.info/api/editCategory.php', {
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
            setResponseMessage("Category updated successfully.");
        }
          console.log(responseData);  // Handle the response data (e.g., display a message)
          //setResponseMessage("User updated successfully!");
      } catch (error) {
          console.error('Error:', error);
          setResponseMessage("Failed to edit category.");
      }
      
    };
    
    
  return (
    <div id="panel">
      <Link to="/categories"><h1 style={{textAlign:'center',color:"black",textDecoration:"none"}}>Edit category Panel</h1></Link>
      <h4 style={{textAlign:'center',marginBottom:'10px'}}>Inventory Management System</h4>
      <form onSubmit={handleSubmit} action="" method="POST">
        <label>Category</label><br/>
        <input required id="category" value={formData.category} onChange={handleChange} type="text" placeholder="Category" name="category"/><br/><br/>
        <input type="submit" value="Edit"/>
      </form>
      {responseMessage && <p style={{marginTop:"10px"}}>{responseMessage}</p>}
    </div>
  )
}

export default EditUser
