import React, { useState, useEffect ,useRef} from 'react';
import "./AddUser.css";
import { Link, useNavigate } from 'react-router-dom';
import Menu from './Menu'
function AddProduct() {
  const navigate = useNavigate();
  let currentDate = new Date();
  const total = useRef(null)
  const msg = useRef(null)

  // Format the date to YYYY-MM-DD (the format accepted by input[type="date"])
let formattedDate = currentDate.toISOString().split('T')[0];
  const [formDataa, setFormDataa] = useState({
          price: '',
          qty: 1,
          date:formattedDate,
          totalPrice:""
        });
        
  const [products, setProducts] = useState(null);
  const [flag, setFlag] = useState(false);

  const [totalPrice, setTotalPrice] = useState(null);
  const [responseText, setResponseText] = useState(null);
  const num = useRef(null)
  const [formData, setFormData] = useState({
    product:''
  });
  useEffect(() => {
                    fetch('http://localhost/api/getProducts.php')
                        .then((response) => response.json())
                        .then((data) => {
                            console.log(data);
                            setProducts(data); // Fallback to empty array if 'data' is not available
                      })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                }, []);
  const [image, setImage] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    // Check if user is authorized to access this page
    if (!localStorage.getItem('role')) {
      navigate('/');
    }
  }, [navigate]);

 const handle = (e)=>{
  e.target.parentElement.parentElement.style.display ="none"
 }

  const handleChange = (e) => {
    setFormDataa((prevData) => ({
      ...prevData,
      totalPrice: "",
      qty:1
    }));
    console.log(e.target.value)
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleChangee = (e) => {
    const { name, value } = e.target;
    
    // Calculate totalPrice on the fly
    const updatedQty = value;
    const updatedTotalPrice = responseText.buying_price * updatedQty;
  
    // Update formDataa with new qty and calculated totalPrice
    setFormDataa((prevData) => ({
      ...prevData,
      [name]: updatedQty,
      totalPrice: updatedTotalPrice
    }));
  };
  const handleClick = async (e) => {
    try {
        // Create a plain object instead of FormData
        const data = {
            id: e.target.value,
        };

        // Send the JSON data to the PHP script
        const response = await fetch('http://localhost/api/FindProduct.php', {
            method: 'POST',
            body: JSON.stringify(data), // Serialize the data as JSON
            headers: {
                'Content-Type': 'application/json', // Ensure the request is sent as JSON
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseTex = await response.json();  // Get raw response text
        setResponseText(responseTex)
        console.log("Raw Response:", responseText);  // Log the raw response
    } catch (error) {
        console.error('Error:', error);
        setResponseMessage("Failed to add product.");
    }
}



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Create a FormData instance
      const data = new FormData();
      
      data.append('name', responseText.title);
      data.append('quantity', formDataa.qty);
      data.append('total', total.current.textContent);
      data.append('date', formDataa.date);
      
      for (let [key, value] of data.entries()) {
        console.log(key + ': ' + value);
    }  
      // Do not set 'Content-Type' here, as the browser will handle it
      const response = await fetch('http://localhost/api/AddSale.php', {
        method: 'POST',
        body: data,  // Send data as a JSON object
    });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const responseData = await response.text();
      console.log(responseData);  // Handle the response data (e.g., display a message)
      setResponseMessage("Sale added successfully!");
      setFlag(true)

    } catch (error) {
      console.error('Error:', error);
      setResponseMessage("Failed to add product.");
    }
  };

  return (
    <>
    <Menu />
    
       <div id="anel">
        <select required id="product" name="product" onClick={handleClick} value={formData.product} onChange={handleChange}>
            {products && products.length>0 && products.map((product)=>{
                return (
                    <option value={product.id}  key={product.id}>{product.title}</option>
                )
            })}
        </select>
        <form action="" method="post">
            <h1>Sale Edit</h1>
            <table>
              <thead>
                <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                  {responseText && (
                    <tr>
                    <td>{responseText.title}</td>
                    <td>{responseText.buying_price}</td>
                    <td><input name="qty" value={formDataa.qty} onChange={handleChangee} type="number"/></td>
                    <td ref={total}>{formDataa.totalPrice==""?responseText.buying_price:formDataa.totalPrice}</td>
                    <td><input value={formDataa.date} onChange={handleChange} type="date"/></td>
                    <td><button onClick={handleSubmit}>Add Sale</button></td>
                    </tr>
                  )}
                </tbody>
            </table>
        </form>
       </div>
      {flag && responseMessage && <div ref={msg}><p style={{ marginTop: "10px" }}>{responseMessage} <span style={{cursor:'pointer'}} onClick={()=>{setFlag(false)}}>X</span></p></div>}
    
    </>

  );
}

export default AddProduct;
