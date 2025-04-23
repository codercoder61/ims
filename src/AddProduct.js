import React, { useState, useEffect } from 'react';
import "./AddUser.css";
import { Link, useNavigate } from 'react-router-dom';

function AddProduct() {
  const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    in_stock: 0,
    buying_price: 0,
    selling_price: 0,
    added: null
  });
  const [image, setImage] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
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
  useEffect(() => {
    // Check if user is authorized to access this page
    if (!localStorage.getItem('role')) {
      navigate('/');
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

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
      // Create a FormData instance
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('in_stock', formData.in_stock);
      data.append('buying_price', formData.buying_price);
      data.append('selling_price', formData.selling_price);
      data.append('added', new Date().toISOString()); // Add current datetime
      if (image) {
        data.append('image', image); // Append the image file
      }
  
      // Send the FormData object to the PHP script
      console.log(data);
  
      // Do not set 'Content-Type' here, as the browser will handle it
      const response = await fetch('http://soc-net.info/api/AddProduct.php', {
        method: 'POST',
        body: data, // Directly send FormData without any headers
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log(responseData);  // Handle the response data (e.g., display a message)
      setResponseMessage("Product added successfully!");
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage("Failed to add product.");
    }
  };

  return (
    <div id="panel">
      <Link to="/products">
        <h1 style={{ textAlign: 'center', color: 'black', textDecoration: 'none' }}>Add Product Panel</h1>
      </Link>
      <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>Inventory Management System</h4>
      <form onSubmit={handleSubmit} method="POST">
        <label>Product Title</label><br />
        <input required id="product_title" value={formData.title} onChange={handleChange} type="text" placeholder="Product Title" name="title" /><br />
        <label>Category</label><br />
<select required id="category" value={formData.category} onChange={handleChange} name="category">
<option selected>Please Select a category</option>
    {categories && categories.map(category => {
        return <option key={category.id} value={category.category}>{category.category}</option>;
    })}
</select><br />

        <label>Product Quantity</label><br />
        <input required id="product_quantity" value={formData.in_stock} onChange={handleChange} type="number" placeholder="Product Quantity" name="in_stock" /><br />
        <label>Buying Price</label><br />
        <input required id="buying_price" value={formData.buying_price} onChange={handleChange} type="number" placeholder="Buying Price" name="buying_price" /><br />
        <label>Photo</label><br />
        <input required id="photo" onChange={handleImageChange} name="image" type="file" /><br />
        <label>Selling Price</label><br />
        <input required id="selling_price" value={formData.selling_price} onChange={handleChange} type="number" placeholder="Selling Price" name="selling_price" /><br /><br />
        <input type="submit" value="Add Product" />
      </form>
      {responseMessage && <p style={{ marginTop: "10px" }}>{responseMessage}</p>}
    </div>
  );
}

export default AddProduct;
