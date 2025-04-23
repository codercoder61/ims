import React, { useEffect, useState } from 'react';
import Menu from './Menu';
import { useNavigate } from 'react-router-dom';
//import { useLocation } from 'react-router-dom';
import './Products.css';
import { Link } from 'react-router-dom';

function Products() {
    const navigate = useNavigate();
    //const location = useLocation();
    const [products, setProducts] = useState(null);
    //const data = location.state;
    //const [responseMessage, setResponseMessage] = useState('');

    /*const [formData, setFormData] = useState({
            category: ''
          });*/ 
          useEffect(() => {
                  fetch('http://soc-net.info/api/getProducts.php')
                      .then((response) => response.json())
                      .then((data) => {
                          console.log(data);
                          setProducts(data); // Fallback to empty array if 'data' is not available
                    })
                      .catch((error) => {
                          console.error('Error:', error);
                      });
              }, []);
        
          
          
    useEffect(() => {
        if (!localStorage.getItem('username')) {
            navigate('/');
        }
    }, [navigate]);

    /*if (data) {
        localStorage.setItem('role', data.role); // Save the theme in localStorage
        localStorage.setItem('username', data.username); // Save the theme in localStorage
    }*/
        /*const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData({
              ...formData,
              [name]: value
            });
          };*/
    const deleteProduct = (id) => {
        // Send data to PHP via a POST request
        //console.log(id);  // For debugging
    
        fetch('http://soc-net.info/api/deleteProduct.php', {
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
    const editProduct = (id) => {
        navigate(`/editProduct?id=${id}`);
    };
    
    
    return (
        <>
            <Menu />
            <div id="users">
            <div style={{margin:'20px',backgroundColor:'white',display:"inline-block",padding:"20px"}}>
                <Link to="/addproduct">Add New Product</Link>
            </div>
            {Array.isArray(products) && products.length > 0 ? (
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Photo</th>
                <th>Product Title</th>
                <th>Categories</th>
                <th>In-Stock</th>
                <th>Buying Price</th>
                <th>Selling Price</th>
                <th>Product Added</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {products.map((product) => {
                return (
                    <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>
                            <img
                                src={`data:image/jpeg;base64,${product.photo}`}
                                alt={`Image of ${product.title}`}
                                className="product-photo" // Use a CSS class for styling
                            />
                        </td>
                        <td>{product.title}</td>
                        <td>{product.category}</td>
                        <td>{product.in_stock}</td>
                        <td>{product.buying_price} DH</td>
                        <td>{product.selling_price} DH</td>
                        <td>{product.added}</td>
                        <td className="actions">
                            <span onClick={() => editProduct(product.id)}>
                                <i className="fa-solid fa-pen-to-square"></i>
                            </span>
                            <span onClick={() => deleteProduct(product.id)}>
                                <i className="fa-solid fa-trash"></i>
                            </span>
                        </td>
                    </tr>
                );
            })}
        </tbody>
    </table>
) : (
    <p style={{marginLeft:"20px"}}>No products available</p> // Handle the case where products is empty or not an array
)}



            </div>
        </>
    );
}

export default Products;
