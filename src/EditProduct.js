import React, { useState, useEffect } from 'react';
import "./AddUser.css";
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function AddProduct() {
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
    title: '',
    category: '',
    in_stock: 0,
    buying_price: 0,
    selling_price: 0,
    added: null,
    id:param1
  });
  const [image, setImage] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
useEffect(() => {
        fetch('http://soc-net.info/api/getCategories.php')
            .then((response) => response.json())
            .then((data) => {
                //console.log(data);
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
useEffect(() => {
          
          const fetchProduct = async () => {
             
            try {
          
              let datas = {
                idProduct : parseInt(param1)
              }
              const response = await fetch('http://soc-net.info/api/getProduct.php', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ idProduct: param1 }),
              });
          
              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
          
              const responseData = await response.json();
              //console.log(JSON.parse(responseData)); // Attempt to parse as JSON
              setFormData({
                ...formData,
                title: responseData.title,
                category: responseData.category,
                in_stock: responseData.in_stock,
                buying_price: responseData.buying_price,
                selling_price: responseData.selling_price,
              });
              console.log(responseData);  // Handle the response data (e.g., display a message)
              //setResponseMessage("User updated successfully!");
             
              
          } catch (error) {
              console.error('Error:', error);
              setResponseMessage("Failed to edit category.");
          }
          
        };

        fetchProduct()
        }, []);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
    setFormData({
      ...formData,
      image:image,
      added:formatDateForMySQL(new Date())
    });
  };

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

    // Create a new FormData object to hold the form data and image
    const data = new FormData();
    
    data.append('image', image); // Append the image file
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('in_stock', formData.in_stock);
    data.append('buying_price', formData.buying_price);
    data.append('selling_price', formData.selling_price);
    data.append('added', formData.added);
    data.append('id', formData.id); // Example ID, change as necessary
    console.log(data,formData)
    /*for (let pair of data.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
  }*/
  try {
    const response = await fetch('http://soc-net.info/api/editProduct.php', {
      method: 'POST',
      body: data, // Send FormData directly
    });
  
    const textResponse = await response.json(); // Get the raw response text
    console.log('Raw Response:', textResponse.message);
    setResponseMessage(textResponse.message)
    // Check if response is valid JSON
    
  
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while uploading the product.');
  }
  };


  

  return (
    <div id="panel">
      <Link to="/products">
        <h1 style={{ textAlign: 'center', color: 'black', textDecoration: 'none' }}>Edit Product Panel</h1>
      </Link>
      <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>Inventory Management System</h4>
      <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
        <label>Product Title</label><br />
        <input required id="product_title" value={formData.title} onChange={handleChange} type="text" placeholder="Product Title" name="title" /><br />
        <label>Category</label><br />
<select required id="category" value={formData.category} onChange={handleChange} name="category">
<option>Please Select a category</option>
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
        <input type="submit" value="Edit Product" />
      </form>
      {responseMessage && <p style={{ marginTop: "10px" }}>{responseMessage}</p>}
    </div>
  );
}

export default AddProduct;
