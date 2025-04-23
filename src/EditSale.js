import React, { useState, useEffect } from 'react';
import "./AddUser.css";
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function EditSale() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    function formatDateForMySQL(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');  // Months are zero-indexed
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    const param1 = queryParams.get('id');
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        total: 0,
        id:param1
    });
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    // Check if user is authorized to access this page
    if (!localStorage.getItem('role')) {
      navigate('/');
    }
  }, [navigate]);
useEffect(() => {
          
          const fetchProduct = async () => {
             
            try {
          
              let datas = {
                idProduct : parseInt(param1)
              }
              const response = await fetch('https://soc-net.info/api/getSale.php', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ idSale: param1 }),
              });
          
              if (!response.ok) {
                  throw new Error(`https error! status: ${response.status}`);
              }
          
              const responseData = await response.json();
              //console.log(JSON.parse(responseData)); // Attempt to parse as JSON
              setFormData({
                ...formData,
                name: responseData.name,
                quantity: responseData.quantity,
                total: responseData.total,
              });
              //setResponseMessage("User updated successfully!");
             
              
          } catch (error) {
              console.error('Error:', error);
              setResponseMessage("Failed to edit category.");
          }
          
        };

        fetchProduct()
        }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
};
  /*useEffect(() => {
    console.log(formData); // This will log after formData has been updated
  }, [formData]); // Runs every time formData changes*/
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to be sent in JSON format
    const data = {
        name: formData.name,
        quantity: formData.quantity,
        total: formData.total,
        id: formData.id
    };

    try {
        const response = await fetch('https://soc-net.info/api/editSale.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Indicate that we're sending JSON data
            },
            body: JSON.stringify(data) // Convert the JavaScript object into a JSON string
        });

        // Parse the response as JSON
        const jsonResponse = await response.json(); // Parse as JSON

        // Log the raw response for debugging
        console.log('Raw Response:', jsonResponse);

        // Set the response message based on the response from the server
        setResponseMessage(jsonResponse.message);

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while uploading the product.');
    }
};



  

  return (
    <div id="panel">
      <Link to="/sales">
        <h1 style={{ textAlign: 'center', color: 'black', textDecoration: 'none' }}>Edit Sale Panel</h1>
      </Link>
      <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>Inventory Management System</h4>
      <form onSubmit={handleSubmit} method="POST">
        <label>Product Title</label><br />
        <input required id="product_title" value={formData.name} onChange={handleChange} type="text" placeholder="Product Title" name="name" /><br />


        <label>Product Quantity</label><br />
        <input required id="product_quantity" value={formData.quantity} onChange={handleChange} type="number" placeholder="Product Quantity" name="quantity" /><br />
        <label>Total Price</label><br />
        <input required id="buying_price" value={formData.total} onChange={handleChange} type="number" placeholder="Buying Price" name="total" /><br /><br />
        <input type="submit" value="Edit Product" />
      </form>
      {responseMessage && <p style={{ marginTop: "10px" }}>{responseMessage}</p>}
    </div>
  );
}

export default EditSale;
