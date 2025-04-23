import React, { useEffect, useState } from 'react';
import Menu from './Menu';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './Categories.css';

function Categories() {
    const navigate = useNavigate();
    const location = useLocation();
    const [categories, setCategories] = useState([]);
    //const data = location.state;
    const [responseMessage, setResponseMessage] = useState('');

    const [formData, setFormData] = useState({
            category: ''
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
        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData({
              ...formData,
              [name]: value
            });
          };
    const deleteCategory = (id) => {
        // Send data to PHP via a POST request
        //console.log(id);  // For debugging
    
        fetch('http://soc-net.info/api/deleteCategory.php', {
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
    const editCategory = (id) => {
        navigate(`/editCategory?id=${id}`);
    };
    useEffect(() => {
        fetch('http://soc-net.info/api/getCategories.php')
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setCategories(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);
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
          const response = await fetch('http://soc-net.info/api/AddCategory.php', {
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
          setResponseMessage("Category added successfully!");
          window.location.reload();
        } catch (error) {
          console.error('Error:', error);
          setResponseMessage("Failed to add user.");
      }
      
    };
    return (
        <>
            <Menu />
            <div id="users">
                <div style={{backgroundColor:'white',display:"inline-block",padding:"20px"}}>
                    <h1>Add New Category</h1>
                    <form action="" onSubmit={handleSubmit} method="post">
                        <input type="text" name='category' value={formData.category} onChange={handleChange} placeholder='Category Name' />
                        <input type="submit" value="Add Category"/>
                        {responseMessage && <p style={{marginTop:"10px"}}>{responseMessage}</p>}
                    </form>
                </div>
                {categories && (
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Categories</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{category.id}</td>
                                        <td>{category.category}</td>
                                        <td style={{display:'flex',justifyContent:'space-around'}}>
                                            <span onClick={()=>editCategory(category.id)}>
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </span>
                                            <span onClick={()=>deleteCategory(category.id)}>
                                                <i className="fa-solid fa-trash"></i>
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

export default Categories;
