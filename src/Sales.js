import React, { useEffect, useState } from 'react';
import Menu from './Menu';
import { useNavigate } from 'react-router-dom';
//import { useLocation } from 'react-router-dom';
import './Products.css';
import { Link } from 'react-router-dom';

function Products() {
    const navigate = useNavigate();
    //const location = useLocation();
    const [sales, setSales] = useState(null);
    //const data = location.state;
    //const [responseMessage, setResponseMessage] = useState('');

    /*const [formData, setFormData] = useState({
            category: ''
          });*/ 
          useEffect(() => {
                  fetch('https://soc-net.info/api/getSales.php')
                      .then((response) => response.json())
                      .then((data) => {
                          console.log(data);
                          setSales(data); // Fallback to empty array if 'data' is not available
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
    const deleteSale = (id) => {
        // Send data to PHP via a POST request
        //console.log(id);  // For debugging
    
        fetch('https://soc-net.info/api/deleteSale.php', {
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
    const editSale = (id) => {
        navigate(`/editSale?id=${id}`);
    };
    
    
    return (
        <>
            <Menu />
            <div id="users">
            <div style={{margin:'20px',backgroundColor:'white',display:"inline-block",padding:"20px"}}>
                <Link to="/addsale">Add New Sale</Link>
            </div>
            {Array.isArray(sales) && sales.length > 0 ? (
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Date</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {sales.map((sale) => {
                return (
                    <tr key={sale.id}>
                        <td>{sale.id}</td>
                        <td>{sale.name}</td>
                        <td>{sale.quantity}</td>
                        <td>{sale.total} DH</td>
                        <td>{sale.date}</td>
                        <td style={{display:'flex',justifyContent:"space-around"}} className="actions">
                            <span onClick={() => editSale(sale.id)}>
                                <i className="fa-solid fa-pen-to-square"></i>
                            </span>
                            <span onClick={() => deleteSale(sale.id)}>
                                <i className="fa-solid fa-trash"></i>
                            </span>
                        </td>
                    </tr>
                );
            })}
        </tbody>
    </table>
) : (
    <p style={{marginLeft:"20px"}}>No Sales available</p> // Handle the case where products is empty or not an array
)}



            </div>
        </>
    );
}

export default Products;
